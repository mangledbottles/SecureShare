<script lang="ts">
  export let name: string;
  import { username, user, userPassphrase } from "./User";
  import Header from "./Header.svelte";
  import Chat from "./Chat.svelte";
  import Auth from "./Auth.svelte";
  import Screenshot from "./Screenshot.svelte";

  const isScreenAccessPermitted =
    process.env.screenAccessPermission === "granted" ||
    process.env.screenAccessPermission == null;
</script>

<main>
  <Header {name} />
  {#if !isScreenAccessPermitted}
    <div>
      <h2>
        You must allow Secure Share to access Screen. This is used to take a
        screenshot.
      </h2>
      <h3>
        To do this, goto System Preferences -> Privacy -> Screen Recording;
        enable this application.
      </h3>
    </div>
  {/if}
  {#if $username && $userPassphrase == "" && isScreenAccessPermitted}
    <Screenshot />
    <Chat />
  {:else if isScreenAccessPermitted}
    <Auth />
  {/if}
</main>

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
