import { loginUser, logoutUser, getCurrentUser } from "@/api"

const user = {
    state() {
        return {
            userObject: null, // tu trzymany aktualnie zalogowany user
            userLoading: false, // a tutaj info czy logowanie, wylogowanie i pobieranie current usera z serwera
        }
    },

    mutations: {
        // ustawianie usera w store
        SET_CURRENT_USER(state, userObject) {
            state.userObject = userObject;
        },
        // zmienia loading
        SET_CURRENT_USER_LOADING(state, userLoading) {
            state.userLoading = userLoading;
        }
    },

    getters: {
        // pobiera aktualnego usera w store
        GET_CURRENT_USER(state) {
            return state.userObject;
        },
        // pobiera loading usera
        GET_CURRENT_USER_LOADING(state) {
            return state.userLoading;
        }
    },

    actions: {
        // ta akcja dostaje dane logowania z formularza
        LOGIN_USER({ commit, getters }, { email, password }) {
            commit("SET_CURRENT_USER_LOADING", true); // startuje loading

            return loginUser({ email, password }) // wywoluje api
                .then((userObject) => {
                    // jak serwer zwroci usera z emailem to
                    if (userObject.email) {
                        commit("SET_CURRENT_USER", userObject); // zapisuje usera do store
                    }
                })
                .finally(() => {
                    commit("SET_CURRENT_USER_LOADING", false); // na koncu wylaczanie loadingu
                });
        },

        // czysci usera ze w store i wywoluje logout na serwerze
        LOGOUT_USER({ commit }) {
            commit("SET_CURRENT_USER", null);
            return logoutUser();
        },

        // odswieza store
        FETCH_CURRENT_USER({ commit, getters }) {
            // jesli user juz jest w store
            if (getters.GET_CURRENT_USER) {
                console.log("jest user w store");
                return Promise.resolve(); // to nic nie pobieram jeszcze raz
            } else {
                commit("SET_CURRENT_USER_LOADING", true);

                return getCurrentUser()  // jak go nie ma to pobieram go z serwera na podstawie cookie
                    .then((userObject) => {
                        console.log("biorę usera z serwera", userObject);

                        // jesli serwer zwroci email
                        if (userObject.email) {
                            commit("SET_CURRENT_USER", userObject); // to zapisuje go do store
                        }
                    })
                    .finally(() => {
                        commit("SET_CURRENT_USER_LOADING", false); // na koncu wylaczenie loadingu
                    });
            }
        }
    }
}

export default user