import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

interface IMatch {
  id: number;
  league: string;
  status: string;
  round: string;
  timestamp: number;
  goalsHome: number;
  goalsAway: number;
}

const convertDateToString = () => {
  const today = new Date();
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return formatDate(today);
};

export const processBets = functions.pubsub
  .schedule("every 3 hours")
  .onRun(async (context: any) => {
    try {
      const usersSnapshot = await admin.firestore().collection("users").get();
      console.log("Fetching users from Firestore:", usersSnapshot.size);

      const fixtureResults: IMatch[] = [];
      const currentDate = convertDateToString();
      const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${currentDate}`;
      const headers = {
        "x-rapidapi-key": "9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      };

      // Wykonaj zapytanie HTTP do API
      const response = await axios.get(url, { headers });
      const data = response.data;

      // Zapisz wyniki meczów
      data.response.forEach((game: any) => {
        const match: IMatch = {
          id: game.fixture.id,
          league: "pol",
          status: game.fixture.status.short,
          round: game.league.round,
          timestamp: game.fixture.timestamp,
          goalsHome: game.score.fulltime.home,
          goalsAway: game.score.fulltime.away,
        };
        fixtureResults.push(match);
        console.log("Match found:", match);
      });

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const betsSnapshot = await admin.firestore()
          .collection("users")
          .doc(userId)
          .collection("bets")
          .where("counted", "==", false)
          .where("league", "==", "pol")
          .get();

        for (const betDoc of betsSnapshot.docs) {
          const betData = betDoc.data();
          const { matchId, home, away } = betData;
          console.log(`${matchId}: Home: ${home}, Away: ${away}`);

          const fixture = fixtureResults.find(f => f.id === matchId);
          if (fixture) {
            let points = 0;

            console.log(`${fixture.goalsHome}-${fixture.goalsAway} ? ${home}-${away}`);
            const betDifference = home - away;
            const matchDifference = fixture.goalsHome - fixture.goalsAway;

            if (betDifference === matchDifference) {
              if (fixture.goalsHome === home && fixture.goalsAway === away) {
                points = 3; 
              } else {
                points = 1;              }
            }

            await betDoc.ref.update({
              counted: true,
              points: points,
            });

            await admin.firestore().collection("users").doc(userId).update({
              pol: admin.firestore.FieldValue.increment(points),
            });
          }
        }
      }

      console.log("Bet processing completed successfully!");
    } catch (error) {
      console.error("Error processing bets:", error);
    }
  });
