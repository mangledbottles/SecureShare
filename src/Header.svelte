<script lang="ts">
  // Import dependencies
  import { username, user, userPassphrase, receivedScreenshots, selectedScreenshot, selectedContact } from "./User";

  // Import components from Attractrions
  import { Subhead, Label, Chip } from "attractions";

  export let name: string;
  function signout() {
    console.log("signing out");
    user.leave();
    username.set("");
    receivedScreenshots.set([]);
    selectedScreenshot.set(null);
    selectedContact.set(null);
  }

  // Import dependencies
  import { PopoverPositions } from "attractions/popover";
  import { Popover, Button, PopoverButton } from "attractions";
  import Clipboard from "svelte-clipboard";

  function continueToApplication() {
    userPassphrase.set("");
  }
</script>

<header>
  <h1>{name}
    <Chip small>Decentralysed End-to-End Encrypted Sharing Platform</Chip>
  </h1>


  {#if $userPassphrase}
    <Subhead>Save your User ID (username) and passphrase</Subhead>
    <Subhead
      >You can share your User ID with anyone, but keep your passphrase secure.
      Write it onto a piece of paper or save it to a file. You can copy both
      User ID and passphrase by clicking on them.</Subhead
    >
    <br />
    <Clipboard
      text={$username}
      let:copy
      on:copy={() => {
        console.log("copied");
      }}
    >
      <Button on:click={copy}>Username: {$username}</Button>
    </Clipboard>

    <Clipboard
      text={$userPassphrase}
      let:copy
      on:copy={() => {
        console.log("copied");
      }}
    >
      <Button on:click={copy}>Passphrase: {$userPassphrase}</Button>
      <Label small
        >This passphrase is not recoverable so ensure to write down</Label
      >
    </Clipboard>

    <Button filled on:click={continueToApplication}>Continue</Button>
  {:else if $username}
    <div class="user-bio">

      <Popover position={PopoverPositions.BOTTOM}>
        <Clipboard
          text={$username}
          let:copy
          on:copy={() => {
            console.log("copied");
          }}
        >
          <Button on:click={copy}>Username: {$username}</Button>
          <div slot="popover-content">
            <PopoverButton>copy</PopoverButton>
          </div>
        </Clipboard>
      </Popover>

    <button class="signout-button" on:click={signout}>Sign Out</button>

      <!-- <img
        src={`https://avatars.dicebear.com/api/initials/${$username}.svg`}
        alt="avatar"
      /> -->
    </div>

  {/if}
</header>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
