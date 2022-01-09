<script lang="ts">
  import { user, userPassphrase } from "./User";

  // Import dependencies
  import randomWords from "random-words";
  import { v4 as uuidv4 } from "uuid";

  // Import Attractions UI Components
  import { Card, Button, FormField, TextField, Divider } from "attractions";

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
      userPassphrase.set(password);
      login();
    });

  }
</script>

<Card>
  <FormField>
    <Button filled on:click={signup}>Create Account</Button>
  </FormField>
</Card>

<Divider text="OR" />

<Card>
  <FormField name="Username" help="" required>
    <TextField bind:value={username} />
  </FormField>

  <FormField
    name="Password"
    help="8 word passphrase, seperated by a space"
    required
  >
    <TextField bind:value={password} />
  </FormField>

  <FormField>
    <Button filled class="login" on:click={login}>Login</Button>
  </FormField>
</Card>
