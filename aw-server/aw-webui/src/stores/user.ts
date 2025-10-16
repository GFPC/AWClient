import { getClient } from '~/util/awclient';
import { defineStore } from 'pinia';

interface State {
  username: string;
  uuid: string;
  data: any;
  team: string;
  created: string;
  isExistOnServer: boolean;
  _loaded: boolean;
}
export const useUserStore = defineStore('user', {
  state: (): State => ({
    username: '',
    uuid: '',
    data: {},
    team: '',
    created: '',
    isExistOnServer: false,
    _loaded: false,
  }),
  actions: {
    async ensureLoaded() {
      if (!this._loaded) {
        await this.load();
      }
    },
    async load() {
      const client = getClient();
      this.uuid = await client.req.get('/0/uuid');
      this.uuid = this.uuid.data.uuid;
      const user_data = await client.req.get('/0/gfps/user/' + this.uuid);
      if (!user_data.data.error) {
        this.username = user_data.data.user.username;
        this.team = user_data.data.user.team;
        this.created = user_data.data.user.created;
        this.isExistOnServer = true;
      } else {
        this.isExistOnServer = false;
      }
      this._loaded = true;
    },
    async register(data) {
      const client = getClient();
      await client.req
        .post('/0/gfps/user', { uuid: this.uuid, username: data.username || this.username, team: data.team })
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
        .put('/0/gfps/user', { uuid: this.uuid, username: data.username || this.username, team: data.team })
        .then(response => {
          this.isExistOnServer = !response.data.error;
        });
    },
    async setState(new_state) {
      this.$patch(new_state);
    },
  },
  getters: {
    loaded(state: State) {
      return state._loaded;
    },
  },
});
