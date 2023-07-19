import { Client, EmbedBuilder, TextChannel, Message } from 'discord.js'
import { injectable } from 'inversify'

import { RconService } from './RconService'

@injectable()
export class PlayerListService {
  private message: Message<true> | null = null

  private channel: TextChannel | null = null

  constructor(
    private client: Client,
    private rcon: RconService,
  ) {
    this.rcon.setResponseCallback((response) => this.onResponse(response))
    this.fetchChannel().then(() => this.clearChannel())
  }

  updatePlayers() {
    if (this.rcon.isReady()) {
      this.rcon.request('players')
    }
  }

  async fetchChannel() {
    const channel = await this.client.channels.fetch(
      process.env.DISCORD_PLAYER_COUNT_CHANNEL_ID!,
    )

    if (channel instanceof TextChannel) {
      this.channel = channel
    }
  }

  async clearChannel() {
    if (this.channel) {
      this.channel.bulkDelete(1)
    }
  }

  async onResponse(response: string) {
    const players = response
      .split('\n')
      .splice(1)
      .map((player) => player.substring(1))

    const embed = new EmbedBuilder()
      .setColor(0x8bb7b4)
      .setTitle('Connected players')
      .setDescription(players.join('\n') || 'No players connected')
      .setImage(
        'https://media.discordapp.net/attachments/997930916280270889/1130581036670144613/gencraft_image_1684643526743.png',
      )
      .setTimestamp()
      .addFields({
        name: 'Total players connected',
        value: `${0}/32`,
      })
      .setFooter({ text: 'Bot made with ♥ by the Frostbite team' })

    if (this.channel) {
      if (this.message) {
        this.message.edit({ embeds: [embed] })
      } else {
        this.message = await this.channel.send({ embeds: [embed] })
      }
    }
  }
}
