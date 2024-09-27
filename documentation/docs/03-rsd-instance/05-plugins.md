<!--
SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences

SPDX-License-Identifier: CC-BY-4.0
-->

# Configuring Plugins

The RSD offers limited support for plugins, meaning that third party services can add provide links in dedicated slots (plugin slots) within the user interface.

Plugins need to be integrated into the Docker environment so that they can be executed on the same server.

## RSD frontend configuration

For the frontend to know which plugins should be used, add them to the `settings.json` inside the `host` property:

```json
{
  "host": {
    "plugins": ["pluginName"]
  }
}
```

## nginx configuration

Add the `pluginName` to `nginx.conf` as a new location:

```nginx
server {
	location /modules/pluginName/ {
		resolver 127.0.0.11 valid=30s ipv6=off;
		set $pluginbackend <PluginBackendContainer>;
		proxy_pass http://$pluginbackend:<Port>;
	}
}
```
:::tip
Using this configuration, nginx will not exit upon starting if the plugin backend is not reachable yet. 127.0.0.11 is the docker internal resolver.
:::

Replace `<PluginBackendContainer>` and `<Port>` by the respective container name and port where the backend is accessible. This is provided in the documentaiton of the plugin.
