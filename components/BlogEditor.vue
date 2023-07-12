<template>
  <div id="posts">
    <div class="card-container">
      <div v-for="item in posts" class="card">
        <img :src="getImage(item)" alt="Featured Image" class="cover" />
        <div class="text">
          <span class="title">{{ item.title.rendered }}</span>
          <span v-html="item.excerpt.rendered.replace(/<\/p>\s*<p>/g, '<br><br>').replace(/<\/?p>/g, '')" class="excerpt"></span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- <pre id="json">{{ JSON.stringify(posts, null, 2) }}</pre> -->
</template>

<script setup>

const posts = useFetch('http://184.72.214.248/wp-json/wp/v2/posts?_embed').data._rawValue;

function getImage(item) {
  if (item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]) {
    return item._embedded['wp:featuredmedia'][0].source_url;
  } else {
    return '/placeholder.png'
  }
}
</script>

<style lang="scss">

#posts {
  width: 90vw;
  height: calc(100vh - 10vw);
  border: 1px solid black;
  margin: 5vw;

  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    .card {
      position: relative;
      justify-content: center;
      align-items: center;
      border: 1px solid #ccc;
      margin: 10px;
      width: 300px;
      height: 300px;
      overflow: visible;

      .cover {
        margin: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      :hover + .text {
        color: white;
        background-color: rgba(0, 0, 0, 0.651);
      }

      .text {
        margin: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        overflow-y: hidden;
        background-color: rgba(0, 0, 0, 0);
        color: rgba(255, 255, 255, 0);
        pointer-events: none;
        display: flex;
        flex-direction: column;;
        justify-content: center;
        align-items: center;

        .title {
          margin: 0;
          width: 100%;
          height: 1em;
          text-align: center;
          font-weight: 900;
          font-size: 18px;
          display: block;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 5%;
        }

        .excerpt {
          margin: 0;
          width: 100%;
          height: fit-content;
          max-height: 10em;
          font-size: 14px;
          display: block;
          overflow: hidden;
        }

      }
    }
  }
}


#json {
  height: 500px;
  overflow-y: scroll;
  color: grey;
}

</style>