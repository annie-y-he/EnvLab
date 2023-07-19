<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">

@import '@/styles/media.scss';
@import url('https://fonts.googleapis.com/css?family=Roboto');

*{
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;

  &:hover {
    font-weight: bold;
  }
}

.text {
  width: 100%;
  padding: 0 15vw;
  overflow: visible;
  font-size: 18px;

  @media (max-width: $bpw-phone) {
    padding: 0;
  }
}

.overlay {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background-image: linear-gradient(to bottom, #00000000, #000000);
  overflow-y: scroll;
}

.underlay {
  width: 100vw;
  height: 100vh;
  z-index: 1;
  .cover {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.footer {
  margin-top: 10px;
  margin-bottom: 30px;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffffb0;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #000000a4;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #000000;
}

</style>