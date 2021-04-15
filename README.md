> This plugin is outdated. As an alternative, please refer to [Christoph Giesches Home Assistant plugin for Stream Deck](https://github.com/cgiesche/streamdeck-homeassistant).

> Not working with self signed certificates.

# Home Assistant for Elgato Stream Deck
> Use the Elgato Stream Deck as Home Assistant controller. Call any available service and toggle lights or resume your music.

Should work cross-platform. Tested with macOS Mojave and HassOS on RPi0W.

Not using Home Assistant but still want to control your devices without a server? Check out my other repositories and try the IFTTT Integration [here](https://github.com/tobimori/streamdeck-ifttt).
## How to use

This Integration uses the Home Assistant REST API and Service Calls.

### General installation & setup

Download the latest release [here](https://github.com/tobimori/streamdeck-homeassistant/releases/latest "Hello from the other side...") and execute the file. The Stream Deck software should ask you to continue the installation.

![Installation](resources/readme/installation.png)

### Creating a new action

Drag and drop the Home Assistant action from the Action list to the Canvas area. Select it and configure it.

You can get a long-live access token by creating on your profile in Home Assistant. (Just add "/profile" to your url if you don't find it)

For configuring the other required options, check [here](https://www.home-assistant.io/docs/scripts/service-calls/).
Service data should be served in json like [here](https://www.home-assistant.io/docs/scripts/service-calls/#using-the-services-developer-tool).

To test out your service calls, check the Service development tool on your Home Assistant instance.

## Support

Feel free to ask your questions/report bugs on the [community-ran Elgato Discord Server](https://discord.gg/aWVu2eM). I'm there too ;)
