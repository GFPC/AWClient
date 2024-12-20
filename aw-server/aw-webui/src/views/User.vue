<template lang="pug">
  div
    h3 User zone
    | Account info

    div.alert.alert-danger(v-if="error")
      | {{error}}

    div.alert-warning(v-if="!userStore.isExistOnServer && userStore._loaded")
        | User with uuid '{{userStore.uuid}}' does not exist on the server,
        p
          | Enter username and click Submit buuton, it will be created

    form
    div.form-row
      div.form-group.col-md-6
        | Username
        input.form-control(type="text", v-model="username")
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

    hr
</template>

<script lang="ts">

import { useUserStore } from '~/stores/user';
export default {
  name: 'User',
  data() {
    return {
      error: '',
      username: '',
      userStore: useUserStore(),
    }
  },
  mounted: async function () {
    // await this.userStore.load();
    this.init()
  },
  methods: {
    async init(){
      this.username = this.userStore.username
    },
    async submit() {
      if (!this.userStore.isExistOnServer) {
        await this.userStore.register({
          username: this.username
        });
      } else {
        await this.userStore.update({
          username: this.username
        });
      }
    }
  }
};
</script>
