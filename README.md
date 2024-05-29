#  splider-wallhaven-api

爬取 wallhaven 的图片信息

## 使用

#### clone 仓库

```bash
git clone https://github.com/ivwv/splider-wallhaven-api
cd splider-wallhaven-api
npm i
```

#### 配置环境变量

将 `.env.simple` 重命名为 `.env`

- `MYSQL_HOST`: **必填**，MySQL 主机地址
- `MYSQL_USER`: **必填**，MySQL 用户名
- `MYSQL_PASSWORD`: **必填**，MySQL 密码
- `MYSQL_DATABASE`: **必填**，MySQL 数据库名
- `MYSQL_PORT`: **必填**，MySQL 端口号
- `START`: **必填**，开始页数
- `END`: *可选*，结束页数，设置需要爬取到的最后一页
- `IS_SPIDER`: *可选*，是否进行爬取
- `HTTP_PROXY`: *可选*，HTTP 代理
- `API_KEY`: **必填**，Wallhaven API 密钥

#### 运行

创建数据库

```sql
CREATE TABLE wallpapers (
    id VARCHAR(255),
    url VARCHAR(255),
    short_url VARCHAR(255),
    views VARCHAR(255),
    favorites VARCHAR(255),
    source VARCHAR(255),
    purity VARCHAR(255),
    category VARCHAR(255),
    dimension_x VARCHAR(255),
    dimension_y VARCHAR(255),
    resolution VARCHAR(255),
    ratio VARCHAR(255),
    file_size VARCHAR(255),
    file_type VARCHAR(255),
    created_at VARCHAR(255),
    colors VARCHAR(255),
    path VARCHAR(255),
    thumbs VARCHAR(255)
);
```

运行脚本

```bash
npm run start
```

## 高级

### 提高爬取速度

当前版本使用多线程方式进行爬取，但受网络限制，过多的同时请求可能导致出现 `Too Many Requests (429)` 错误。为了解决这个问题，需要自行配置反向代理。

请修改 `utils/domains.json` 文件。该文件每隔1分钟自动读取一次，如果持续请求错误，请适当修改该数组。由于会随机选择数组中的域名进行请求，所以可以将同一个域名设置多次，以增加其请求权重。

```json
[
  "wallhaven.cc"
]
```

### 使用设置HTTP代理方式加速爬取

如果是在本地环境进行爬取，可以设置 `HTTP_PROXY` 环境变量。在这里，我使用的是 `clash verge rev`。

然而，我发现 `clash verge rev` 自动选择的节点并不会经常变化，容易导致出现 `Too Many Requests (429)` 响应。为了解决这个问题，我的建议是使用 `clash verge rev` 的外部控制接口 `ip:port`，通过接口的方式切换节点。

请修改 `change-proxy.js` 文件，设置 `clash_api` 为你自己的接口地址，以及 `proxie` 为你希望使用的节点名称。

```js
const clash_api = "http://127.0.0.1:9097";
const proxie = "🚀 节点选择";
```

完成以上修改后，在命令行中执行以下命令以自动切换节点：

```bash
node change-proxy.js
```

通过设置 `HTTP_PROXY` 代理，并自动切换节点，可以极大减少出现 `429`, `503`, `403` 等错误的概率。
