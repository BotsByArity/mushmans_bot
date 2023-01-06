const E621 = require('e621');
const { SlashCommandBuilder, EmbedBuilder, IntegrationApplication } = require('discord.js');
const { e621Token } = require('../config.json');
const { colors } = require("../functions/e621_colors.js")
const e621 = new E621({
  authKey: e621Token,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("e621")
    .setDescription('Replies with yiff')
    .addIntegerOption(option => option.setName("id").setDescription("Look up the post using an ID"))
    .addStringOption(option => option.setName("tags").setDescription("Look up a post by tags")),
  async execute(interaction) {
    interaction.deferReply();
    const id = interaction.options.getInteger("id");
    const tag = interaction.options.getString("tags");

    if (id) {
      e621.posts.get(id).then(post => {
      console.log(post)
      const tags = []; // q - 3792162

      // combine all tags into the tags variable
      tags.push(post.tags.general.join(", "), post.tags.species.join(", "), post.tags.character.join(", "), post.tags.copyright.join(", "), post.tags.invalid.join(", "), post.tags.lore.join(", "), post.tags.meta.join(", "));
      const newTags = tags.filter(arr => arr != '');

      const e621Embed = new EmbedBuilder()
        .setColor(colors(post.rating))
        .setTitle(`${post.tags.artist.length == 0 ? "No artist found" : post.tags.artist[0]}`)
        .setURL(`https://e621.net/posts/${post.id}`)
        .addFields(
          { name: "Post ID", value: `${post.id}`},
          { name: "Rating", value: `${post.rating}` },
          { name: "Tags", value: `\`${newTags.sort().join(", ")}\`` }
        )
        .setImage(post.file.ext == "webm" ? post.sample.url : post.file.url)
        .setFooter({ text: `${post.file.width}x${post.file.height}, ${Math.round(post.file.size/1000)} KB, ${post.score.up} ⇑ ${post.score.down} ⇓`, iconURL: "https://en.wikifur.com/w/images/d/dd/E621Logo.png" });
      interaction.editReply({ embeds: [e621Embed] });
      });
    } else if (tag) {
      const tagLookup = tag.split(" ");
      tagLookup.push("order:random");
      e621.posts.search({ tags: tagLookup }).then(post => {
        const tagSearch = [];
        
        if (post[0] == undefined) return interaction.reply("No post found.");

        tagSearch.push(post[0].tags.general.join(", "), post[0].tags.species.join(", "), post[0].tags.character.join(", "), post[0].tags.copyright.join(", "), post[0].tags.invalid.join(", "), post[0].tags.lore.join(", "), post[0].tags.meta.join(", "));
        const newTagSearch = tagSearch.filter(arr => arr != '');

        const e621TagEmbed = new EmbedBuilder()
          .setColor(colors(post[0].rating))
          .setTitle(`${post[0].tags.artist.length == 0 ? "No artist found" : post[0].tags.artist[0]}`)
          .setURL(`https://e621.net/posts/${post[0].id}`)
          .addFields(
            { name: "Post ID", value: `${post[0].id}`},
            { name: "Rating", value: `${post[0].rating}` },
            { name: "Tags", value: `\`${newTagSearch.sort().join(", ")}\`` }
          )
          .setImage(post[0].file.ext == "webm" ? post[0].sample.url : post[0].file.url)
          .setFooter({ text: `${post[0].file.width}x${post[0].file.height}, ${Math.round(post[0].file.size/1000)} KB, ${post[0].score.up} ⇑ ${post[0].score.down} ⇓`, iconURL: "https://en.wikifur.com/w/images/d/dd/E621Logo.png" });
        interaction.editReply({ embeds: [e621TagEmbed] });
      });
    } else {
      e621.posts.search({ tags: `order:random` }).then(post => {
        const tagRandom = [];

        tagRandom.push(post[0].tags.general.join(", "), post[0].tags.species.join(", "), post[0].tags.character.join(", "), post[0].tags.copyright.join(", "), post[0].tags.invalid.join(", "), post[0].tags.lore.join(", "), post[0].tags.meta.join(", "));
        const newTagRandom = tagRandom.filter(arr => arr != '');

        const e621TagEmbed = new EmbedBuilder()
          .setColor(colors(post[0].rating))
          .setTitle(`${post[0].tags.artist.length == 0 ? "No artist found" : post[0].tags.artist[0]}`)
          .setURL(`https://e621.net/posts/${post[0].id}`)
          .addFields(
            { name: "Post ID", value: `${post[0].id}`},
            { name: "Rating", value: `${post[0].rating}` },
            { name: "Tags", value: `\`${newTagRandom.sort().join(", ")}\`` }
          )
          .setImage(post[0].file.ext == "webm" ? post[0].sample.url : post[0].file.url)
          .setFooter({ text: `${post[0].file.width}x${post[0].file.height}, ${Math.round(post[0].file.size/1000)} KB, ${post[0].score.up} ⇑ ${post[0].score.down} ⇓`, iconURL: "https://en.wikifur.com/w/images/d/dd/E621Logo.png" });
        interaction.editReply({ embeds: [e621TagEmbed] });
      });
    }
  }
}