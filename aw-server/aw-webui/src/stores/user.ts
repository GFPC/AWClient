import { getClient } from '~/util/awclient';
import { defineStore } from 'pinia';

interface State {
  username: string;
  uuid: string;
  data: any;
  created: string;
  isExistOnServer: boolean;
  _loaded: boolean;
}
export const useUserStore = defineStore('user', {
  state: (): State => ({
    username: '',
    uuid: '',
    data: {},
    created: '',
    isExistOnServer: false,
    _loaded: false,
  }),
  actions: {
    async load() {
      const client = getClient();
      await client.req.get('/0/uuid').then(response => {
        this.uuid = response.data.uuid;
        client.req.get('/0/gfps/user/' + this.uuid).then(response => {
          if (!response.data.error) {
            this.username = response.data.user.username;
            this.data = response.data.user.data;
            this.created = response.data.user.created;
            this.isExistOnServer = true;
          } else {
            this.isExistOnServer = false;
          }
        });
      });
    },
    async register(data) {
      const client = getClient();
      await client.req
        .post('/0/gfps/user', { uuid: this.uuid, username: data.username || this.username })
        .then(response => {
          if (!response.data.error) {
            this.uuid = response.data.uuid;
            this.isExistOnServer = true;
          } else {
            this.isExistOnServer = false;
          }
        });
    },
    async update(data) {
      const client = getClient();
      await client.req
        .put('/0/gfps/user', { uuid: this.uuid, username: data.username || this.username})
        .then(response => {
          this.isExistOnServer = !response.data.error;
        });
    },
    async setState(new_state) {
      this.$patch(new_state);
    }
  },
  getters: {
    loaded(state: State) {
      return state._loaded;
    },
  },

});
