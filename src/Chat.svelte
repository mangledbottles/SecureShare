<script>
  // Import dependencies
  import { Button } from "attractions";
  import { Autocomplete } from "attractions";

  import GUN from "gun";
  const gun = new GUN();

  import {
    username,
    receivedScreenshots,
    selectedScreenshot,
    selectedContact,
  } from "./User";

  // on button click, set username
  function setUsername() {
    console.log({ msg: "updating username", username });
    startGun();
  }

  // Load screenshots received from Gun, listen for incoming
  gun
    .get("screenshots")
    .get($username)
    .map()
    .once((data, id) => {
      receivedScreenshots.set([...$receivedScreenshots, data]);
    });

  // Send screenshot to Gun user
  function sendMessage() {
    console.log("sending message");
    const index = new Date().toISOString();
    console.log({ username, uusername: $username });
    console.log(
      `Sending message in 'screenshots' to ${$username} at index ${index}`
    );

    gun
      .get("screenshots")
      .get($selectedContact)
      .get(index)
      .put({
        image: $selectedScreenshot,
        message: `Heres a screenshot from ${$username}`,
        from: `${$username}`,
      });
  }

  // AutoComplete component to search for user contact
  let currentChosenContact = [];
  async function* getOptions(selectedOption) {
    let options = [];


    await gun.get(`~@${selectedOption}`).once((data, userId) => {
      if (!data) return; // if no result, return

      console.log({ data, key: userId });

      // Set the current chosen contact
      // remove first 2 characters of userId


      selectedContact.set(userId.substring(2));
      console.log({ selectedContact})
      console.log({ selectedContact: $selectedContact });

      options.push({
        name: userId,
        details: `Unique Identifier ${data._}`,
      });

      console.log({ key: userId });
    });

    yield options;
  }

  // When a user selects a contact, store the contact's public key to local storage
  function onContactSelection() {
    console.log({ currentChosenContact })

    let contacts = JSON.parse(localStorage.getItem("Contacts")) || [];
    if (
      !contacts.find((contact) => contact.name === currentChosenContact.name)
    ) {
      contacts.push(currentChosenContact);
      localStorage.setItem("Contacts", JSON.stringify(contacts));
    }

    alert("Contact added successfully");

    // Remove user input selection forn
    selectedOption = [];
  }

  let selectedOption = [];
</script>

<div class="container">
  <h1>Add Contact</h1>
  <Autocomplete
    {getOptions}
    on:change={onContactSelection}
    selection={selectedOption}
  />
  <Button filled on:click={sendMessage}>Send Secure Share</Button>

  <!-- for each image in array receivedScreenshots display in svelte -->
  <div class="screenshots">
    {#each $receivedScreenshots as screenshot}
      <img src={screenshot.image} alt="screenshot" />
    {/each}
  </div>
</div>
