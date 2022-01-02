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
  // AutoComplete component to search for user contact
  async function* getOptions(username) {
    let options = [];

    await gun
      .get("Users")
      .get(username)
      .on((user, key) => {
        console.log({ user, key });
        options.push({
          name: user.name,
          details: `Unique Identifier ${user.id}`,
        });
      });

    yield options;
  }

  // When a user selects a contact, store the contact's public key to local storage
  function onContactSelection() {
    console.log({ selectedContact });

    let contacts = JSON.parse(localStorage.getItem("Contacts")) || [];
    contacts.push(selectedContact);
    localStorage.setItem("Contacts", JSON.stringify(contacts));
    alert("Contact added successfully");

    console.log({ localStorage });

    // Remove user input selection forn
    selectedContact = [];
  }

  let selectedContact = [];
</script>

<div class="container">
  <h1>Add Contact</h1>
  <Autocomplete
    {getOptions}
    on:change={onContactSelection}
    selection={selectedContact}
  />
  <!-- <Button filled>Send Secure Share</Button> -->
</div>
