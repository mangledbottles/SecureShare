<script>
  // Import dependencies
  import { Button } from "attractions";
  import { Autocomplete } from "attractions";

  import GUN from "gun";
  const gun = new GUN();

  //   import { user, userData } from "./User";
  //   console.log({ user, userData });

  let username = "Mark";

  //   if(username) startGun();

  // on button click, set username
  function setUsername() {
    console.log({ msg: "updating username", username });
    startGun();
  }

  function startGun() {
    console.log("starting gun");
    gun.get("Users").get(username).put({
      name: "Mark",
      email: "mark@gun.eco",
    });

    gun
      .get("Users")
      .get(username)
      .on(async (data, key) => {
        console.log("realtime updates:", data);
        console.log({ key });
        let account = await gun.get("Users").get(username).get("account");
        console.log("account", account);
      });

    setInterval(() => {
      let index = new Date().toISOString();
      gun
        .get("Users")
        .get(username)
        .get("account")
        .get(index)
        .put({ details: Math.random() });
    }, 4000);
  }
</script>

<div class="container">
  <h1>Chat loaded</h1>
  <input type="text" id="username" bind:value={username} />
  <button on:click={setUsername}>Send</button>
  <h1>Add Contact</h1>
  <Autocomplete
  />
  <!-- <Button filled>Send Secure Share</Button> -->
</div>
