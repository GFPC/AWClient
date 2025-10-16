<template lang="pug">
  div
    h3 User zone

    hr

    div.alert.alert-danger(v-if="error")
      | {{error}}
    form(v-if="userStore.isExistOnServer && userStore._loaded")
      div.form-row
        div.form-group.col-md-6
          | Username
          input.form-control(type="text", v-model="username")
      div.form-row
        div.form-group.col-md-6
          | Team ID
          input.form-control(type="text", v-model="team_id")
      div.form-row
        div.form-group.col-md-6
          | UUID
          input.form-control(type="text", v-model="userStore.uuid", :disabled="true")
      div.form-row
        div.form-group.col-md-6
          | Created
          input.form-control(type="text", v-model="userStore.created", :disabled="true")
      div.form-group
        div.form-group
          button.btn.btn-success(type="button", @click="this.submit") Submit
    form(v-if="!userStore.isExistOnServer && userStore._loaded")
      div.form-row
        div.form-group.col-md-6
          | Username
          input.form-control(type="text", v-model="username")
      div.form-row
        div.form-group.col-md-6
          | Team ID
          input.form-control(type="text", v-model="team_id")
      div.form-row
        div.form-group.col-md-6
          | UUID
          input.form-control(type="text", v-model="userStore.uuid", :disabled="true")
          icon(name="info-circle")
          span
            | This field is generated automatically

      div.form-group
        div.form-group
          button.btn.btn-success(type="button", @click="this.submit") Register

    hr
</template>

<script lang="ts">
import { useUserStore } from '~/stores/user';
import 'vue-awesome/icons/info-circle.js';
export default {
  name: 'User',
  data() {
    return {
      error: '',
      username: '',
      team_id: '',
      userStore: useUserStore(),
    };
  },
  mounted: async function () {
    await this.init();
  },
  methods: {
    async init() {
      await this.userStore.ensureLoaded();
      this.username = this.userStore.username;
      this.team_id = this.userStore.team;
    },
    async submit() {
      if (!this.userStore.isExistOnServer) {
        await this.userStore.register({
          username: this.username,
          team: this.team_id,
        });
      } else {
        await this.userStore.update({
          username: this.username,
          team: this.team_id,
        });
      }
      window.location.reload();
    },
  },
};
</script>
