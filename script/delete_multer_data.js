/**
 * 用于删除数据库中重复的数据
 */
require("dotenv").config(); 
const mysql = require("mysql2/promise");
const {pool} = require("../pool");

async function main() {
  // 创建数据库连接
  const connection = await mysql.createConnection(pool);

  try {
    // 查询重复的id及其数量
    const [rows] = await connection.execute(`
            SELECT id, COUNT(id) AS count
            FROM wallpapers
            GROUP BY id
            HAVING count > 1
        `);

    // 循环处理每个重复的id
    for (const row of rows) {
      const { id, count } = row;
      let deleteCount = count - 1; // 需要删除的数量

      // 删除重复的id数据
      while (deleteCount > 0) {
        await connection.execute(
          `
                    DELETE FROM wallpapers
                    WHERE id = ?
                    LIMIT 1
                `,
          [id]
        );
        deleteCount--;
      }
    }

    console.log("删除重复数据完成");
  } catch (error) {
    console.error("执行查询时出错：", error);
  } finally {
    // 关闭数据库连接
    await connection.end();
  }
}

main();
