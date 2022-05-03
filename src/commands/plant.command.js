const { SlashCommandBuilder } = require('@discordjs/builders');
const Player = require('../models/player.model.js');
const Crop = require('../models/crop.model.js');

// name must be lowercase
// description cannot be absent

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plant')
		.setDescription('Plant crop at target location')
		.addIntegerOption(option =>
			option
				.setName('row')
				.setDescription('Plant crop at row.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('col')
				.setDescription('Plant crop at column.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('seed')
				.setDescription('Crop to be planted')
				.setRequired(true)
				.addChoices({
					name: 'Carrot',
					value: 'Carrot'
				})),

	async execute(interaction) {
		// Need offset by 1
		const row = interaction.options.getInteger('row') - 1;
		const col = interaction.options.getInteger('row') - 1;
		const seed = interaction.options.getString('seed');

		const userId = interaction.user.id;
		const player = await Player.findOne({ userId }).populate('farm').exec();
		const crops = player.farm;

		const newCrop = await Crop.findOne({ name: seed }).exec();

		console.log(`Player ${interaction.user.username} wants to plant ${seed} at Col:${col} Row:${row}`);

		if (player.money < newCrop.price) {

		}

		// Calculate index (row major ordering)
		const index = row * player.farmWidth + col;

		if (crops[index].name !== "Empty")
			await interaction.reply({ content: 'Farmland is not empty', empheral: true });

		if (!newCrop)
			await interaction.reply({ content: `Crop named ${newCrop.name} is not found`, empheral: true });

		await Player.updateOne({ userId }, {
			$set: {
				[`farm.${index}`]: newCrop.id,
				money: player.money - newCrop.price
			}
		});

		await interaction.reply(`Planted ${newCrop.name}`);
	},
};

