<template>
  <div>
    <div class="card-container">
      <div v-for="item in posts.data._rawValue" :key="item.id" class="card">
        <h2>{{ item.title.rendered }}</h2>
        <img :src="getFeaturedMediaUrl(item.featured_media)" alt="Featured Image">
        <span v-html="item.excerpt.rendered" class="excerpt"></span>
      </div>
    </div>
  </div>
  <!-- <pre id="json">{{ JSON.stringify(posts, null, 2) }}</pre> -->
</template>

<script setup>

const posts = useFetch('http://184.72.214.248/wp-json/wp/v2/posts?_embed');

console.log(JSON.stringify(useFetch('http://184.72.214.248/wp-json/wp/v2/posts?_embed'), null, 2));

</script>

<script>

const getFeaturedMediaUrl = (mediaId) => {
  // Make a separate API request to retrieve the media information
  const mediaUrl = ref('');

  // Fetch the media data based on the mediaId
  fetch(`http://184.72.214.248/wp-json/wp/v2/media/${mediaId}`)
    .then((response) => response.json())
    .then((data) => {
      // Extract the media URL from the response and store it in the mediaUrl ref
      mediaUrl.value = data.source_url;
    })
    .catch((error) => {
      console.error('Error fetching media:', error);
    });

  return mediaUrl;
};

</script>

<style lang="scss">

.card-container {
  display: flex;
  flex-wrap: wrap;
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  .excerpt {
    p {
      margin-bottom: 1em; /* Adjust the line spacing between paragraphs */
      
      &:last-child {
        margin-bottom: 0; /* Remove the extra spacing at the end of the last paragraph */
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