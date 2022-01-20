<script>
  // Import dependencies
  import { Button } from "attractions";
  import { Autocomplete } from "attractions";

  import {
    username,
    receivedScreenshots,
    selectedScreenshot,
    selectedContact,
    db,
    senderKeyPairs,
    receiverKeyPairs,
  } from "./User";

  // Get the senders (logged in user) cryptographically secure public/private key pair
  //    Contains the public key (pub), the private key (priv), the epub
  //    (encryption public key) and the epriv (encryption private key)
  const senderPair = db.user()._.sea;
  senderKeyPairs.set({ ...$senderKeyPairs, ...senderPair });

  // Load screenshots received from Gun, listen for incoming
  db
    .get("screenshots")
    .get($username)
    .map()
    .once((data, id) => {
      console.log({ data, id, message: "screenshots loaded" });
      receivedScreenshots.set([...$receivedScreenshots, data]);
    });

  const getUserEPub = async (alias) => {
    // check if alias starts with ~@ (database format for user alias)
    if (!alias.startsWith("~@")) alias = `~@${alias}`;

    const userAccount = await db.get(alias).once();
    if (!userAccount) return;

    // Get the receivers public key (pub)
    const receiverPubKey = Object.keys(userAccount)[1].substring(1);
    // Get the receivers public key for encryption (epub)
    const receiverEPub = await db.user(receiverPubKey).get("epub");

    return receiverEPub;
  };

  // Send screenshot to Gun user
  const sendMessage = async () => {
    console.log("sending message");
    const index = new Date().toISOString();
    console.log({ username, uusername: $username });
    console.log(
      `Sending message in 'screenshots' to ${$selectedContact} at index ${index} from ${$username}`
    );

    // const receivingContact = ($selectedContact).splice(2);

    db
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

    // Find user in database (if it exists)
    await db.get(`~@${selectedOption}`).once(async (data, userId) => {
      if (!data) return; // if no result, return

      // Set the current chosen contact
      selectedContact.set(userId.substring(2)); // remove the ~@

      options.push({
        name: userId,
        details: `Unique Identifier ${data._}`,
      });


      /**
       * End-to-end encryption (E2EE)
       */

      // Get the receivers public key for encryption (epub)
      const receiverEPub = await getUserEPub(userId);
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
