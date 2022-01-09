<script lang="ts">
  // Import dependencies
  import { username, user, userPassphrase } from "./User";

  // Import components from Attractrions
  import { Subhead, Label, Chip } from "attractions";

  export let name: string;
  function signout() {
    console.log("signing out");
    user.leave();
    username.set("");
  }

  // Import dependencies
  import { PopoverPositions } from "attractions/popover";
  import { Popover, Button, PopoverButton } from "attractions";
  import Clipboard from "svelte-clipboard";
  //   import { clipboard } from 'electron';

  //   function copyUsername() {
  //       console.log("copying username");
  //     this.clipboard.writeText(username);
  // clipboard.writeText(username);
  //   }
</script>

<header>
  <h1>{name}</h1>
  {#if $username}
    <div class="user-bio">
      <span>Hello <strong>{$username}</strong></span>

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

      <!-- <img
        src={`https://avatars.dicebear.com/api/initials/${$username}.svg`}
        alt="avatar"
      /> -->
    </div>

    <button class="signout-button" on:click={signout}>Sign Out</button>
  {:else}
    <h3>Gun.js Chat</h3>
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
