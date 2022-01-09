<script lang="ts">
  import { user, userPassphrase } from "./User";

  // Import dependencies
  import randomWords from "random-words";
  import { v4 as uuidv4 } from "uuid";

  let username, password;

  function login() {
    user.auth(username, password, ({ err }) => {
      if (err) return alert(err);

      console.log("Login success");
    });
  }

  function signup() {
    username = uuidv4().split("-").join("");
    password = randomWords({
      exactly: 8,
      join: " ",
      formatter: (word) => word.toUpperCase(),
    });

    user.create(username, password, ({ err }) => {
      if (err) return alert(err);

      console.log("Signup success");
      login();
    });
  }
</script>

<label for="username">Username</label>
<input name="username" bind:value={username} minlength="3" maxlength="32" />

<label for="password">Password</label>
<input name="password" bind:value={password} type="password" />

<button class="login" on:click={login}>Login</button>
<button on:click={signup}>Sign Up</button>
