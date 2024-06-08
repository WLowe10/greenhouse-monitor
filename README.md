# A simple Greenhouse monitor for new job postings

## Prerequisites

-   Node

## Get Started

```sh
# clone the repository
git clone --depth 1 --branch master https://github.com/WLowe10/greenhouse-monitor.git

cd greenhouse-monitor

# install dependencies
pnpm install # or npm install

# build
pnpm build # or npm run build

# start
pnpm start # or npm start
```

## Configuration

The project includes a very simple configuration file `monitor.config.js`

```js
/**a @type{import("./src/constants").ConfigType}  */
export default {
	filter: /frontend|backend/i,
	companies: [
		{
			name: "Whop",
		},
	],
};
```
