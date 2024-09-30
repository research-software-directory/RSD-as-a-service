# Plugins

:::info
Plugin support is currently under development and in testing phase, the API may be subject to changes.
:::

The RSD provides limited support for plugins, enabling third-party services to insert links into dedicated areas (plugin slots) within the user interface.

Plugins can be configured so that they can run in the same docker network, or on different servers.

## Configuration

### Environment Variables

If you are deploying the plugins alongside the main RSD in the same Docker network, the frontend container needs access to the environment variable `RSD_REVERSE_PROXY_URL`.
By default, the variable is set to:

```shell
RSD_REVERSE_PROXY_URL=http://nginx
```

### Frontend settings

For the RSD frontend to know which plugins should be used, they are configure in the `host` property of `frontend/public/data/settings.json`:

```json
{
  "host": {
    "plugins": ["<plugin>"]
  }
}
```

Options for `<plugin>`:

* **url**: starting with `http://`or `https://` pointing to the root url of the plugin without `/api`
* **slug**: will be used when querying the plugin settings via `/plugin/<plugin>/api/v1/config` inside the servers own docker network

## nginx configuration

If the plugin is running in the same Docker network, `plugin` must be added to `nginx.conf` as a new location in the main server block:

```nginx
server {
	listen       80 default_server;
	server_name  localhost;

	# ...

	# The root path of the plugin API	
	location /plugin/plugin/api/ {
		resolver 127.0.0.11 valid=30s ipv6=off;
		set $pluginbackend <PluginBackendContainer>;

		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		default_type application/json;
		proxy_pass http://$pluginbackend/;
	}
}
```

:::tip
Using this configuration, nginx will not exit upon starting if the plugin backend is not reachable yet. 127.0.0.11 is the docker internal resolver.
:::

Replace `<PluginBackendContainer>` by the respective container name, and port if necessary, where the backend is accessible.
This information should be provided in the documentation of the plugin.
