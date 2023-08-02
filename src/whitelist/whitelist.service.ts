import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Message, User, codeBlock, EmbedBuilder } from 'discord.js'

import { UserInterface } from './user.interface'
import { RconService } from '../rcon/rcon.service'
import { DiscordService } from '../discord/discord.service'

@Injectable()
export class WhitelistService {
  message: Message

  private static readonly COMMAND = 'w!whitelist '

  private user: UserInterface

  constructor(private rcon: RconService, private discord: DiscordService) {}

  @OnEvent('discord.messageCreate')
  async listenToCommand(message: Message) {
    if (!message.content.startsWith(WhitelistService.COMMAND)) {
      return null
    }

    if (this.isAuthorized(message)) {
      this.message = message

      this.user = {
        username: this.message.content.replace(WhitelistService.COMMAND, ''),
        password: this.generatePassword(),
      }

      message.react('🧟')

      this.rcon.request(
        `adduser "${this.user.username}" "${this.user.password}"`,
      )
    }
  }

  @OnEvent('rcon.adduser')
  async onUserWhitelisted(response: string) {
    if (!response.startsWith('User ')) {
      return this.message.reply(response)
    }

    this.message.reply({ embeds: [this.createEmbed(this.user)] })
  }

  isAuthorized(message: Message) {
    return message.member.roles.cache.has(process.env.DISCORD_MODERATOR_ROLE_ID)
  }

  private generatePassword() {
    return new Array(20)
      .fill(undefined)
      .map(() => String.fromCharCode(Math.random() * 86 + 40))
      .join('')
  }

  private createEmbed(user: UserInterface) {
    return new EmbedBuilder()
      .setColor(0x8bb7b4)
      .setTitle('Welcome new survivor')
      .setDescription(
        `Can you brave the chilling abyss and emerge as the ultimate survivor? Beware, for in Frostbite, death is the least of your nightmares.
        \nSave this information in case you need it later!
        \nPlease check out our <#1058516011642536008> and <#1057808476723744768>.\n`,
      )
      .setImage(
        'https://media.discordapp.net/attachments/997930916280270889/1130581036670144613/gencraft_image_1684643526743.png',
      )
      .setTimestamp()
      .addFields(
        {
          name: 'Username',
          value: codeBlock(user.username),
        },

        {
          name: 'Password',
          value: codeBlock(user.password),
        },
      )
      .setFooter({ text: 'Bot made with ♥ by the Frostbite team' })
  }
}
