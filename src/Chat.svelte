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
  db.get("screenshots")
    .get($username)
    .map()
    .once(async (data, id) => {
      if (data.data == null) return;
      const { data: encryptedImage, from: fromUser } = data;

      const senderEPub = await getUserEPub(fromUser);

      // Decrypt the image
      const decryptSecret = await SEA.secret(senderEPub, $senderKeyPairs);
      const decryptedMessage = await SEA.decrypt(encryptedImage, decryptSecret);
      receivedScreenshots.set([...$receivedScreenshots, decryptedMessage]);
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

    // Encrypt screenshot and message
    const encryptSecret = await SEA.secret(
      $receiverKeyPairs.epub,
      $senderKeyPairs
    );
    const message = {
      image: $selectedScreenshot,
      message: `Heres a screenshot from ${$username}`,
    };
    const encrypted = await SEA.encrypt(message, encryptSecret);

    db.get("screenshots")
      .get($selectedContact)
      .get(index)
      .put({
        data: encrypted,
        from: `${$username}`,
      });

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

      // Get the senders (logged in user) cryptographically secure public/private key pair
      //    Contains the public key (pub), the private key (priv), the epub
      //    (encryption public key) and the epriv (encryption private key)
      const senderPair = db.user()._.sea;

      // Update state with key pairs
      senderKeyPairs.set({ ...$senderKeyPairs, ...senderPair });
      receiverKeyPairs.set({ ...$receiverKeyPairs, epub: receiverEPub });

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
