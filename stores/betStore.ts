import { getAuth } from 'firebase/auth';
import {
  addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where,
  type DocumentReference, orderBy, limit
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { BetModel, type IBet } from '~/models/bet'
import type { IMatch } from '~/models/match';

export const useBetStore = defineStore('bets', () => {
  const auth = getAuth();
  const db = getFirestore();
  const nextGames = ref<IMatch[]>([])
  // const pastGames = ref<any>()
  // const allUserBets = ref<BetModel[]>([])

  const futureUserBets = ref<BetModel[]>([])
  const futureBetsData = ref<IMatch[]>()

  const pastUserBets = ref<BetModel[]>([])
  const pastBetsData = ref<IMatch[]>()

  const convertDateToString = () => {
    const today = new Date();

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 10);
    const lastTwoWeeks = new Date(today)
    lastTwoWeeks.setDate(today.getDate() - 9)

    const todayFormatted = formatDate(today);
    const nextWeekFormatted = formatDate(nextWeek);
    const lastTwoWeeksFormatted = formatDate(lastTwoWeeks)

    console.log(todayFormatted, nextWeekFormatted, lastTwoWeeksFormatted)
    return {
      today: todayFormatted,
      nextWeek: nextWeekFormatted,
      lastTwoWeeks: lastTwoWeeksFormatted
    };
  }

  const fetchNextFixturesData = async (leagueId: number, count: number) => {
    const dates = convertDateToString()
      const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&next=${count}`;
      // const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&from=${dates.today}&to=${dates.nextWeek}&status=NS`
      const headers = {
        'x-rapidapi-key': '9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    };
    
    const league = ref()
    switch (leagueId) {
      case 39:
        league.value = 'eng'
        break;
      case 106:
        league.value = 'pol'
        break;
      case 2:
        league.value = 'ucl'
        break;
    }
    try {
       const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        const data = await response.json();
         data.response.forEach((game: any) => {
          const match: IMatch = {
            id: game.fixture.id,
            league: league.value,
            status: game.fixture.status.short,
            round: game.league.round,
            timestamp: game.fixture.timestamp,
            homeName: game.teams.home.name,
            awayName: game.teams.away.name,
            goalsHome: game.score.fulltime.home,
            goalsAway: game.score.fulltime.away,
            homeLogo: game.teams.home.logo,
            awayLogo: game.teams.away.logo,
            timeElapsed: game.fixture.status.elapsed,
            isFinished: false
          }
          console.log(match)
          // nextGames.value = data.response;
          //  console.log(nextGames.value)
           
           if (nextGames.value != undefined) {
            const existingIndex = nextGames.value.findIndex((g:any) => g.id === match.id);
            if (existingIndex === -1) {
              nextGames.value.push(match);
            } else {
              nextGames.value[existingIndex] = match;
            }
          }
      });
      } catch (error) {
        console.error('Error fetching fixtures data:', error);
        nextGames.value = [];
      }
    }

    const fetchLastFixturesData =  async (leagueId: number, season: number) => {
      const dates = convertDateToString()
      const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&from=${dates.lastTwoWeeks}&to=${dates.today}`
      const headers = {
        'x-rapidapi-key': '9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      }; 
      // pastGames.value = json2
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        const data = await response.json();
        if (data && data.response) {
          // pastGames.value = data.response;
        } else {
          // pastGames.value = null;
        }
        // this.lastGamesData = json
      } catch (error) {
        console.error('Error fetching fixtures data:', error);
        // pastGames.value = null;
      }
    }
  
  const fetchFutureBetsFromFirebase = async (userRef: DocumentReference, league: string) => {
    const betsRef = collection(db, `users/${userRef.id}/bets`);
      const betsQuery = query(
        betsRef,
        where("league", "==", league),
        where("counted", "==", false),
        orderBy("matchDate", "desc"), 
        limit(20)
    );
    
    const querySnapshot = await getDocs(betsQuery);
    const matchIndexes: Number[] = []
    querySnapshot.forEach((doc) => {
      const betData = doc.data() as IBet
      
      if (!futureUserBets.value.find(b => b.matchID === betData.matchID)) {
        const betModel = new BetModel(betData, doc.ref)
        futureUserBets.value.push(betModel);
        matchIndexes.push(betData.matchID)
      }
      // const data = doc.data() as IBet
      // console.log(data)
      // matchIndexes.push(data.matchID)
      // futureUserBets.value.push(data)
    });
    console.log(matchIndexes)
    return matchIndexes;
  }

  const fetchFutureUserBets = async (userRef: DocumentReference, league: string) => {
    const games = await fetchFutureBetsFromFirebase(userRef, league)
    if (!games.length) {
      return
    }
    const matchesString = games.join('-')
    console.log(matchesString)
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?ids=${matchesString}`
    const headers = {
        'x-rapidapi-key': '9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    };
    if (!Array.isArray(futureBetsData.value)) {
      futureBetsData.value = [];
    }
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();
      console.log(data.response)
      data.response.forEach((game: any) => {
        const match: IMatch = {
          id: game.fixture.id,
          league: league,
          status: game.fixture.status.short,
          round: game.league.round,
          timestamp: game.fixture.timestamp,
          homeName: game.teams.home.name,
          awayName: game.teams.away.name,
          goalsHome: game.score.fulltime.home,
          goalsAway: game.score.fulltime.away,
          homeLogo: game.teams.home.logo,
          awayLogo: game.teams.away.logo,
          timeElapsed: game.fixture.status.elapsed,
          isFinished: false
        }
        console.log(match)

        if (futureBetsData.value != undefined) {
          const existingIndex = futureBetsData.value.findIndex((g:any) => g.id === match.id);
          if (existingIndex === -1) {
            // Add newBet to futureBetsData if it doesn't already exist
            futureBetsData.value.push(match);
          } else {
            // Optionally, update the existing bet with new data if needed
            futureBetsData.value[existingIndex] = match;
          }
        }
    });
    console.log(futureBetsData.value);
    } catch (error) {
      console.error('Error fetching fixtures data:', error);
      futureBetsData.value = [];
    }
  }

  const fetchPastBetsFromFirebase = async (userRef: DocumentReference, league: string) => {
    const betsRef = collection(db, `users/${userRef.id}/bets`);
      const betsQuery = query(
        betsRef,
        where("league", "==", league),
        where("counted", "==", true),
        orderBy("matchDate", "desc"), 
        limit(20)
      );

    const querySnapshot = await getDocs(betsQuery);
    const matchIndexes: Number[] = []
    querySnapshot.forEach((doc) => {
      const betData = doc.data() as IBet
      if (!pastUserBets.value.find(b => b.matchID === betData.matchID)) {
        const betModel = new BetModel(betData, doc.ref)
        pastUserBets.value.push(betModel);
        matchIndexes.push(betData.matchID)
      }
      // const data = doc.data() as IBet
      // console.log(data)
      // matchIndexes.push(data.matchID)
      // pastUserBets.value.push(data)
    });
    console.log(matchIndexes)
    return matchIndexes;
  }

  const fetchPastUserBets = async (userRef: DocumentReference, league: string) => {
    const games = await fetchPastBetsFromFirebase(userRef, league)
    const matchesString = games.join('-')
    console.log(matchesString)
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?ids=${matchesString}`
    const headers = {
        'x-rapidapi-key': '9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    };
    
    if (!Array.isArray(pastBetsData.value)) {
      pastBetsData.value = [];
    }
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();
      console.log(data.response)
      data.response.forEach((game: any) => {
        const match: IMatch = {
          id: game.fixture.id,
          league: league,
          status: game.fixture.status.short,
          round: game.league.round,
          timestamp: game.fixture.timestamp,
          homeName: game.teams.home.name,
          awayName: game.teams.away.name,
          goalsHome: game.score.fulltime.home,
          goalsAway: game.score.fulltime.away,
          homeLogo: game.teams.home.logo,
          awayLogo: game.teams.away.logo,
          timeElapsed: game.fixture.status.elapsed,
          isFinished: false
        }
        console.log(match)

        if (pastBetsData.value != undefined) {
          const existingIndex = pastBetsData.value.findIndex((g:any) => g.id === match.id);
          if (existingIndex === -1) {
            pastBetsData.value.push(match);
          } else {
            pastBetsData.value[existingIndex] = match;
          }
        }
    });
    console.log(futureBetsData.value);
    } catch (error) {
      console.error('Error fetching fixtures data:', error);
      pastBetsData.value = [];
    }
  }

    const saveUserBet = async (userRef: DocumentReference, bet: IBet) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const userBetsCollection = collection(db, 'users', userRef.id, 'bets');
        // const isBetExist = allUserBets.value.find(b => b.matchID === bet.matchID)
        const isBetExist = futureUserBets.value.find(b => b.matchID === bet.matchID)
      
        let matchObject: IMatch | undefined
        if (nextGames.value != undefined) {
          matchObject = nextGames.value.find((match: IMatch) => match.id === bet.matchID)
          console.log(matchObject)
        }
      
        if (isBetExist) {
          console.log(isBetExist.reference.id)
          const betDocRef = doc(userBetsCollection, isBetExist.reference.id);
          const betUpdate = {
            matchID: bet.matchID,
            matchDate: bet.matchDate,
            home: bet.home,
            away: bet.away,
            points: bet.points,
            counted: bet.counted,
            league: bet.league
          };
          await updateDoc(betDocRef, betUpdate);
          const betIndex = futureUserBets.value.findIndex(b => b.matchID === isBetExist.matchID);
          if (betIndex !== -1) {
            const newBet = new BetModel(bet, isBetExist.reference)
            // allUserBets.value[betIndex] = newBet;
            futureUserBets.value[betIndex] = newBet
          }
          console.log('Bet updated with ID: ', isBetExist.matchID);
        } else {
          const docRef = await addDoc(userBetsCollection, bet);
          // allUserBets.value.push(new BetModel(bet, docRef))
          futureUserBets.value.push(new BetModel(bet, docRef))

          if (futureBetsData.value != undefined && matchObject != undefined) {
            futureBetsData.value.push(matchObject)
          }

          console.log('Bet saved with ID: ', docRef.id);

        }
      } catch (e) {
        console.error('Error adding or updating document: ', e);
      }

      // const existingBetQuery = query(userBetsCollection, where('matchID', '==', bet.matchID));
      // const querySnapshot = await getDocs(existingBetQuery);
      //   if (!querySnapshot.empty) {
      //     const existingBetDoc = querySnapshot.docs[0]

    }
    
    const fetchAllUserBets = async (userRef: DocumentReference) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      try {
        const userBetsCollection = collection(db, 'users', userRef.id, 'bets');
        const querySnapshot = await getDocs(userBetsCollection);
        const bets: BetModel[] = [];

        querySnapshot.forEach((doc) => {
          const betData = doc.data() as IBet;
          const betModel = new BetModel(betData, doc.ref);
          bets.push(betModel);
        });

        // allUserBets.value = bets;
        // console.log('User bets fetched: ', allUserBets.value);
      } catch (e) {
        console.error('Error fetching user bets: ', e);
      }
    }
  
  return {
    fetchLastFixturesData, fetchNextFixturesData, saveUserBet, fetchAllUserBets,
    fetchPastUserBets, fetchFutureUserBets,
    nextGames,
    pastBetsData, pastUserBets,
    futureBetsData, futureUserBets
  }
})


const json = [ { "fixture": { "id": 1208099, "referee": null, "timezone": "UTC", "date": "2024-10-19T11:30:00+00:00", "timestamp": 1729337400, "periods": { "first": null, "second": null }, "venue": { "id": 593, "name": "Tottenham Hotspur Stadium", "city": "London" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 47, "name": "Tottenham", "logo": "https://media.api-sports.io/football/teams/47.png", "winner": null }, "away": { "id": 48, "name": "West Ham", "logo": "https://media.api-sports.io/football/teams/48.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208095, "referee": null, "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": null, "second": null }, "venue": { "id": 556, "name": "Old Trafford", "city": "Manchester" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 33, "name": "Manchester United", "logo": "https://media.api-sports.io/football/teams/33.png", "winner": null }, "away": { "id": 55, "name": "Brentford", "logo": "https://media.api-sports.io/football/teams/55.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208096, "referee": null, "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": null, "second": null }, "venue": { "id": 562, "name": "St. James' Park", "city": "Newcastle upon Tyne" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 34, "name": "Newcastle", "logo": "https://media.api-sports.io/football/teams/34.png", "winner": null }, "away": { "id": 51, "name": "Brighton", "logo": "https://media.api-sports.io/football/teams/51.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208092, "referee": null, "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": null, "second": null }, "venue": { "id": 535, "name": "Craven Cottage", "city": "London" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 36, "name": "Fulham", "logo": "https://media.api-sports.io/football/teams/36.png", "winner": null }, "away": { "id": 66, "name": "Aston Villa", "logo": "https://media.api-sports.io/football/teams/66.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208098, "referee": null, "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": null, "second": null }, "venue": { "id": 585, "name": "St. Mary's Stadium", "city": "Southampton, Hampshire" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 41, "name": "Southampton", "logo": "https://media.api-sports.io/football/teams/41.png", "winner": null }, "away": { "id": 46, "name": "Leicester", "logo": "https://media.api-sports.io/football/teams/46.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208093, "referee": null, "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": null, "second": null }, "venue": { "id": 545, "name": "Portman Road", "city": "Ipswich, Suffolk" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 57, "name": "Ipswich", "logo": "https://media.api-sports.io/football/teams/57.png", "winner": null }, "away": { "id": 45, "name": "Everton", "logo": "https://media.api-sports.io/football/teams/45.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208091, "referee": null, "timezone": "UTC", "date": "2024-10-19T16:30:00+00:00", "timestamp": 1729355400, "periods": { "first": null, "second": null }, "venue": { "id": 504, "name": "Vitality Stadium", "city": "Bournemouth, Dorset" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 35, "name": "Bournemouth", "logo": "https://media.api-sports.io/football/teams/35.png", "winner": null }, "away": { "id": 42, "name": "Arsenal", "logo": "https://media.api-sports.io/football/teams/42.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208100, "referee": null, "timezone": "UTC", "date": "2024-10-20T13:00:00+00:00", "timestamp": 1729429200, "periods": { "first": null, "second": null }, "venue": { "id": 600, "name": "Molineux Stadium", "city": "Wolverhampton, West Midlands" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 39, "name": "Wolves", "logo": "https://media.api-sports.io/football/teams/39.png", "winner": null }, "away": { "id": 50, "name": "Manchester City", "logo": "https://media.api-sports.io/football/teams/50.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208094, "referee": null, "timezone": "UTC", "date": "2024-10-20T15:30:00+00:00", "timestamp": 1729438200, "periods": { "first": null, "second": null }, "venue": { "id": 550, "name": "Anfield", "city": "Liverpool" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 40, "name": "Liverpool", "logo": "https://media.api-sports.io/football/teams/40.png", "winner": null }, "away": { "id": 49, "name": "Chelsea", "logo": "https://media.api-sports.io/football/teams/49.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208097, "referee": null, "timezone": "UTC", "date": "2024-10-21T19:00:00+00:00", "timestamp": 1729537200, "periods": { "first": null, "second": null }, "venue": { "id": 566, "name": "The City Ground", "city": "Nottingham, Nottinghamshire" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 65, "name": "Nottingham Forest", "logo": "https://media.api-sports.io/football/teams/65.png", "winner": null }, "away": { "id": 52, "name": "Crystal Palace", "logo": "https://media.api-sports.io/football/teams/52.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } } ]

const json2 = [ { "fixture": { "id": 1208099, "referee": "A. Madley", "timezone": "UTC", "date": "2024-10-19T11:30:00+00:00", "timestamp": 1729337400, "periods": { "first": 1729337400, "second": 1729341000 }, "venue": { "id": 593, "name": "Tottenham Hotspur Stadium", "city": "London" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 8 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 47, "name": "Tottenham", "logo": "https://media.api-sports.io/football/teams/47.png", "winner": true }, "away": { "id": 48, "name": "West Ham", "logo": "https://media.api-sports.io/football/teams/48.png", "winner": false } }, "goals": { "home": 4, "away": 1 }, "score": { "halftime": { "home": 1, "away": 1 }, "fulltime": { "home": 4, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208095, "referee": "S. Barrott", "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": 1729346400, "second": 1729350000 }, "venue": { "id": 556, "name": "Old Trafford", "city": "Manchester" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 7 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 33, "name": "Manchester United", "logo": "https://media.api-sports.io/football/teams/33.png", "winner": true }, "away": { "id": 55, "name": "Brentford", "logo": "https://media.api-sports.io/football/teams/55.png", "winner": false } }, "goals": { "home": 2, "away": 1 }, "score": { "halftime": { "home": 0, "away": 1 }, "fulltime": { "home": 2, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208096, "referee": "P. Bankes", "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": 1729346400, "second": 1729350000 }, "venue": { "id": 562, "name": "St. James' Park", "city": "Newcastle upon Tyne" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 11 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 34, "name": "Newcastle", "logo": "https://media.api-sports.io/football/teams/34.png", "winner": false }, "away": { "id": 51, "name": "Brighton", "logo": "https://media.api-sports.io/football/teams/51.png", "winner": true } }, "goals": { "home": 0, "away": 1 }, "score": { "halftime": { "home": 0, "away": 1 }, "fulltime": { "home": 0, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208092, "referee": "D. England", "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": 1729346400, "second": 1729350000 }, "venue": { "id": 535, "name": "Craven Cottage", "city": "London" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 9 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 36, "name": "Fulham", "logo": "https://media.api-sports.io/football/teams/36.png", "winner": false }, "away": { "id": 66, "name": "Aston Villa", "logo": "https://media.api-sports.io/football/teams/66.png", "winner": true } }, "goals": { "home": 1, "away": 3 }, "score": { "halftime": { "home": 1, "away": 1 }, "fulltime": { "home": 1, "away": 3 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208098, "referee": "A. Taylor", "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": 1729346400, "second": 1729350000 }, "venue": { "id": 585, "name": "St. Mary's Stadium", "city": "Southampton, Hampshire" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 10 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 41, "name": "Southampton", "logo": "https://media.api-sports.io/football/teams/41.png", "winner": false }, "away": { "id": 46, "name": "Leicester", "logo": "https://media.api-sports.io/football/teams/46.png", "winner": true } }, "goals": { "home": 2, "away": 3 }, "score": { "halftime": { "home": 2, "away": 0 }, "fulltime": { "home": 2, "away": 3 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208093, "referee": "M. Oliver", "timezone": "UTC", "date": "2024-10-19T14:00:00+00:00", "timestamp": 1729346400, "periods": { "first": 1729346400, "second": 1729350000 }, "venue": { "id": 545, "name": "Portman Road", "city": "Ipswich, Suffolk" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": null } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 57, "name": "Ipswich", "logo": "https://media.api-sports.io/football/teams/57.png", "winner": false }, "away": { "id": 45, "name": "Everton", "logo": "https://media.api-sports.io/football/teams/45.png", "winner": true } }, "goals": { "home": 0, "away": 2 }, "score": { "halftime": { "home": 0, "away": 2 }, "fulltime": { "home": 0, "away": 2 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208091, "referee": "R. Jones", "timezone": "UTC", "date": "2024-10-19T16:30:00+00:00", "timestamp": 1729355400, "periods": { "first": 1729355400, "second": 1729359000 }, "venue": { "id": 504, "name": "Vitality Stadium", "city": "Bournemouth, Dorset" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 6 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 35, "name": "Bournemouth", "logo": "https://media.api-sports.io/football/teams/35.png", "winner": true }, "away": { "id": 42, "name": "Arsenal", "logo": "https://media.api-sports.io/football/teams/42.png", "winner": false } }, "goals": { "home": 2, "away": 0 }, "score": { "halftime": { "home": 0, "away": 0 }, "fulltime": { "home": 2, "away": 0 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208100, "referee": "C. Kavanagh", "timezone": "UTC", "date": "2024-10-20T13:00:00+00:00", "timestamp": 1729429200, "periods": { "first": 1729429200, "second": 1729432800 }, "venue": { "id": 600, "name": "Molineux Stadium", "city": "Wolverhampton, West Midlands" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 7 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 39, "name": "Wolves", "logo": "https://media.api-sports.io/football/teams/39.png", "winner": false }, "away": { "id": 50, "name": "Manchester City", "logo": "https://media.api-sports.io/football/teams/50.png", "winner": true } }, "goals": { "home": 1, "away": 2 }, "score": { "halftime": { "home": 1, "away": 1 }, "fulltime": { "home": 1, "away": 2 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208094, "referee": "J. Brooks", "timezone": "UTC", "date": "2024-10-20T15:30:00+00:00", "timestamp": 1729438200, "periods": { "first": 1729438200, "second": 1729441800 }, "venue": { "id": 550, "name": "Anfield", "city": "Liverpool" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 8 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 40, "name": "Liverpool", "logo": "https://media.api-sports.io/football/teams/40.png", "winner": true }, "away": { "id": 49, "name": "Chelsea", "logo": "https://media.api-sports.io/football/teams/49.png", "winner": false } }, "goals": { "home": 2, "away": 1 }, "score": { "halftime": { "home": 1, "away": 0 }, "fulltime": { "home": 2, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 1208097, "referee": "T. Robinson", "timezone": "UTC", "date": "2024-10-21T19:00:00+00:00", "timestamp": 1729537200, "periods": { "first": 1729537200, "second": 1729540800 }, "venue": { "id": 566, "name": "The City Ground", "city": "Nottingham, Nottinghamshire" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90, "extra": 8 } }, "league": { "id": 39, "name": "Premier League", "country": "England", "logo": "https://media.api-sports.io/football/leagues/39.png", "flag": "https://media.api-sports.io/flags/gb-eng.svg", "season": 2024, "round": "Regular Season - 8" }, "teams": { "home": { "id": 65, "name": "Nottingham Forest", "logo": "https://media.api-sports.io/football/teams/65.png", "winner": true }, "away": { "id": 52, "name": "Crystal Palace", "logo": "https://media.api-sports.io/football/teams/52.png", "winner": false } }, "goals": { "home": 1, "away": 0 }, "score": { "halftime": { "home": 0, "away": 0 }, "fulltime": { "home": 1, "away": 0 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } } ]
