export const state = () => {
  return {
    users: null,
    rankList: null,
    topTen: null,
  };
};

export const getters = {
  getUsers(state) {
    return state.users;
  },
  topTen(state) {
    return state.topTen;
  },
};

export const mutations = {
  setUsers(state, payload) {
    state.users = payload;
  },
  setRankList(state, payload) {
    state.raknList = payload;
  },
  setUserData(state, { responseData, userId }) {
    state.users[userId] = responseData;
  },
  setTopTen(state, payload) {
    state.topTen = payload;
  },
};

export const actions = {
  async getUsers({ commit }) {
    const url = `${process.env.baseUrl}/users.json`;
    const respone = await fetch(url);

    const resData = await respone.json();

    if (!respone.ok) {
      const error = new Error(responseData.message || "Fail to fetch users.");
      throw error;
    }

    commit("setUsers", resData);
  },

  async addGameResult({ state, commit }, { userId, game }) {
    const userData = state.users[userId];

    const isUserGamesArray = userData.games;
    let games = [];
    if (!isUserGamesArray) {
      games.push(game);
    } else {
      games = JSON.parse(JSON.stringify(userData.games));
      games.push(game);
    }

    const newUserData = {
      ...userData,
      games: games,
    };

    const url = `${process.env.baseUrl}/users/${userId}.json`;

    const respone = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(newUserData),
    });

    const responseData = await respone.json();

    if (!respone.ok) {
      const error = new Error(responseData.message || "Fail to fetch users.");
      throw error;
    }

    commit("setUserData", { responseData, userId });
  },

  getUserData({ state }, payload) {
    if (state.users) {
      return state.users[payload];
    } else {
      return null;
    }
  },

  async addTopPlayer({ state, commit }, payload) {
    const url = `${process.env.baseUrl}/top-players.json`;

    const response = await fetch(url);

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "Fail to fetch top players."
      );
      throw error;
    }
    if (responseData) {
      if (responseData.players.length === 10) {
        const sortedPlayers = responseData.players.sort(
          (a, b) => b.game.score - a.game.score
        );
        if (
          sortedPlayers[sortedPlayers.length - 1].game.score <=
          payload.game.score
        ) {
          sortedPlayers.splice(-1, 1);
          sortedPlayers.push({
            ...payload,
            name: state.users[payload.userId].name,
          });

          sortedPlayers.sort((a, b) => b.game.score - a.game.score);

          const res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              players: sortedPlayers,
            }),
          });

          const resData = await res.json();

          if (!res.ok) {
            const error = new Error(
              resData.message || "Fail to fetch create top players."
            );
            throw error;
          }

          commit("setTopTen", sortedPlayers);
          return true;
        }
      } else {
        responseData.players.push({
          ...payload,
          name: state.users[payload.userId].name,
        });

        const sortedPlayers = responseData.players.sort(
          (a, b) => b.game.score - a.game.score
        );

        const res = await fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            players: sortedPlayers,
          }),
        });

        const resData = await res.json();

        if (!res.ok) {
          const error = new Error(
            resData.message || "Fail to fetch create top players."
          );
          throw error;
        }
        commit("setTopTen", sortedPlayers);
        return true;
      }
    } else {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          players: [
            {
              ...payload,
              name: state.users[payload.userId].name,
            },
          ],
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "Fail to fetch create top players."
        );
        throw error;
      }

      commit("setTopTen", responseData.players);
      return true;
    }
  },

  async getTopPlayers({ commit }) {
    const url = `${process.env.baseUrl}/top-players.json`;

    const response = await fetch(url);

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "Fail to fetch top players."
      );
      throw error;
    }

    const data = Object.keys(responseData.players).map(
      (key) => responseData.players[key]
    );

    const sortedPlayers = data.sort((a, b) => b.game.score - a.game.score);

    commit("setTopTen", sortedPlayers);
  },
};
