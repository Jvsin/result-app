import { defineStore } from 'pinia';

export const useLeagueStore = defineStore('league', {
  state: () => ({
    leagueData: null as any | null,
    fixturesData: null as any | null,
  }),
  actions: {
    async fetchLeagueData(leagueId: number, season: number) {
      const url = `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`;
      const headers = {
        'x-rapidapi-key': '9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      };

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        const data = await response.json();
        if (data && data.response && data.response.length > 0) {
          this.leagueData = data.response[0].league;
        } else {
          this.leagueData = null;
        }
      } catch (error) {
        console.error('Error fetching league data:', error);
        this.leagueData = null;
      }
    },

    async fetchFixturesData(leagueId: number, season: number) {
      const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${season}`;
      const headers = {
        'x-rapidapi-key': '9e5e2785cbmshd7e0f7a68c44835p1fd16fjsndac8dbc9c39d',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      };

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        const data = await response.json();
        if (data && data.response) {
          this.fixturesData = data.response;
        } else {
          this.fixturesData = null;
        }
      } catch (error) {
        console.error('Error fetching fixtures data:', error);
        this.fixturesData = null;
      }
    }
  },
});
