// import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import axios from "axios"
import { onSchedule } from "firebase-functions/scheduler"
import * as cors from "cors"
import * as functions from "firebase-functions"

admin.initializeApp()

const corsOptions = {
  origin: "http://localhost:3000",  // Allow requests from localhost:3000
}

interface IMatch {
  id: number;
  league: string;
  status: string;
  round: string;
  timestamp: number;
  goalsHome: number;
  goalsAway: number;
  nameHome: String,
  nameAway: String,
  isFinished: boolean
}

const convertDateToString = () => {
  const today = new Date()
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  return formatDate(today)
}

exports.processBets = onSchedule("every 3 hours", async (event) => {
  try {
    if (false) {
        console.log(event)
      }
      const usersSnapshot = await admin.firestore().collection("users").get()
      console.log("Fetching users from Firestore:", usersSnapshot.size)

      const fixtureResults: IMatch[] = []
      const currentDate = convertDateToString()
      const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${currentDate}&season=2024&league=106`
      const headers = {
        "x-rapidapi-key": "9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      }

      const response = await axios.get(url, { headers })
      const data = response.data
      console.log(data)

      data.response.forEach((game: any) => {
        const match: IMatch = {
          id: game.fixture.id,
          league: "pol",
          status: game.fixture.status.short,
          round: game.league.round,
          timestamp: game.fixture.timestamp,
          goalsHome: game.score.fulltime.home,
          goalsAway: game.score.fulltime.away,
          nameHome: game.teams.home.name,
          nameAway: game.teams.away.name,
          isFinished: game.status.short ? true : false
        }
        fixtureResults.push(match)
        console.log("Match found:", match)
      })

    for (const userDoc of usersSnapshot.docs) {
        console.log("Count points for user: " + userDoc)
        const currentTime = Date.now()
        console.log("Aktualna data " + currentTime)
        const userId = userDoc.id
        const betsSnapshot = await admin.firestore()
          .collection("users")
          .doc(userId)
          .collection("bets")
          .where("counted", "==", false)
          .where("league", "==", "pol")
          .where("matchDate", "<", currentTime)
          .get()

        for (const betDoc of betsSnapshot.docs) {
          const betData = betDoc.data()
          console.log(betData)
          const { matchID, home, away } = betData
          
          const fixture = fixtureResults.find(f => f.id === matchID)
          if (fixture) {
            console.log(`${matchID}: ${fixture.nameHome} ${home} : ${away} ${fixture.nameAway}`)
            let points = 0

            console.log(`${fixture.goalsHome}-${fixture.goalsAway} ? ${home}-${away}`)
            const betDifference = home - away
            const matchDifference = fixture.goalsHome - fixture.goalsAway

            if (fixture.isFinished == true) {
              if (betDifference === matchDifference) {
              if (fixture.goalsHome === home && fixture.goalsAway === away) {
                points = 3
              } else {
                points = 1
              }
              console.log(points + " for correct betting match with id: " + matchID)
              await betDoc.ref.update({
                counted: true,
                points: points,
              })
              await admin.firestore().collection("users").doc(userId).update({
                pol: admin.firestore.FieldValue.increment(points),
              })
            }
            }

            
          }
        }
      }
      console.log("Bet processing completed successfully!")
    } catch (error) {
      console.error("Error processing bets:", error)
    }
})

exports.processBetsHTTP = functions.https.onRequest((req, res) => {
  cors(corsOptions)(req, res, async () => {
    try {
      const usersSnapshot = await admin.firestore().collection("users").get()
      console.log("Fetching users from Firestore:", usersSnapshot.size)

      const fixtureResults: any[]  = []
      const currentDate = convertDateToString()
      console.log(currentDate)
      // const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${currentDate}&season=2024&league=106`
      const url = "https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2024-11-22&season=2024&league=106"

      const headers = {
        "x-rapidapi-key": "9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      }

      const response = await axios.get(url, { headers })
      const data = response.data
      console.log(data)

      data.response.forEach((game: any) => {
        const match = {
          id: game.fixture.id,
          league: "pol",
          status: game.fixture.status.short,
          round: game.league.round,
          timestamp: game.fixture.timestamp,
          goalsHome: game.score.fulltime.home,
          goalsAway: game.score.fulltime.away,
        }
        fixtureResults.push(match)
        console.log("Match found:", match)
      })

      for (const userDoc of usersSnapshot.docs) {
        // const currentTime = admin.firestore.Timestamp.now()
        // const currentTime = admin.firestore.Timestamp.fromMillis(1732319956)
        const currentTime = 1732319956
        console.log("Aktualna data " + Date.now())
        const userId = userDoc.id
        const betsSnapshot = await admin.firestore()
          .collection("users")
          .doc(userId)
          .collection("bets")
          .where("counted", "==", false)
          .where("league", "==", "pol")
          .where("matchDate", "<", currentTime)
          .get()
        
        for (const betDoc of betsSnapshot.docs) {
          const betData = betDoc.data()
          console.log(betData)
          const { matchID, home, away } = betData
          console.log(`${matchID}: Home: ${home}, Away: ${away}`)

          const fixture = fixtureResults.find(f => f.id === matchID)
          if (fixture) {
            let points = 0

            console.log(`${fixture.goalsHome}-${fixture.goalsAway} ? ${home}-${away}`)
            const betDifference = home - away
            const matchDifference = fixture.goalsHome - fixture.goalsAway

            if (betDifference === matchDifference) {
              if (fixture.goalsHome === home && fixture.goalsAway === away) {
                points = 3
              } else {
                points = 1
              }
              await betDoc.ref.update({
                counted: true,
                points: points,
              })
              await admin.firestore().collection("users").doc(userId).update({
                pol: admin.firestore.FieldValue.increment(points),
              })
            }
            
          }
        }
      }

      res.status(200).send("Bet processing completed successfully!")
    } catch (error) {
      console.error("Error processing bets:", error)
      res.status(500).send("Error processing bets")
    }
  })
})
