<script>
  // Import dependencies
  import { Button } from "attractions";
  import { Autocomplete } from "attractions";

  import GUN from "gun";
  const gun = new GUN();

  import { username, receivedScreenshots, selectedScreenshot } from "./User";

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

  gun.get("Users").get("mark").put({
    name: "Mark",
    PublicKey: "XYZ934820KJH",
    id: "f2275fca-1511-4f04-af6d-83841a78eeb4",
  });

  gun.get("Users").get("omni").put({
    name: "Omni",
    PublicKey: "ABC9493890JJIS",
    id: "808982cf-7209-4fc4-82b3-5105204ce306",
  });

  // Gun map over Users and get all the keys
  //   async function* getOptions(username) {
  //     gun
  //       .get("Users")
  //       .map()
  //       .once((user, key) => {
  //           console.log({ user, key });
  //       });
  //   }

  // AutoComplete component to search for user contact
  let currentChosenContact = [];
  async function* getOptions(username) {
    let options = [];

    await gun
      .get("Users")
      .get(username)
      .on((user, key) => {
        console.log({ user, key });

        // Set the current chosen contact
        currentChosenContact = user;

        options.push({
          name: user.name,
          details: `Unique Identifier ${user.id}`,
        });
      });

    yield options;
  }

  // When a user selects a contact, store the contact's public key to local storage
  function onContactSelection() {
    console.log({ currentChosenContact })

    let contacts = JSON.parse(localStorage.getItem("Contacts")) || [];
    if (!(contacts.find((contact) => contact.name === currentChosenContact.name))) {
      contacts.push(currentChosenContact);
      localStorage.setItem("Contacts", JSON.stringify(contacts));
    }

    alert("Contact added successfully");

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
