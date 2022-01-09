<script lang="ts">
  export let name: string;
  import { username, user } from "./User";
  import Header from "./Header.svelte";
  import Chat from "./Chat.svelte";
  import Auth from "./Auth.svelte";
  import Screenshot from './Screenshot.svelte';
</script>

<main>
  <Header name={name} />
  {#if $username}
    <Screenshot />
    <Chat />
  {/if}
  {#if !$username}
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
