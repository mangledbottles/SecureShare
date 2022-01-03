<script lang="ts">
  import { user } from "./User";

  // Import dependencies
  import randomWords from "random-words";
  import { v4 as uuidv4 } from "uuid";

  let username, password;

  function login() {
    console.log("login");
    console.log({ username, password })
    user.auth(username, password, ({ err }) => err && alert(err));

    // console.log(user.map((u) => u.username));
  }
</script>

<label for="username">Username</label>
<input name="username" bind:value={username} minlength="3" maxlength="32" />

<label for="password">Password</label>
<input name="password" bind:value={password} type="password" />

<button class="login" on:click={login}>Login</button>
<button on:click={signup}>Sign Up</button>
