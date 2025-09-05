const mysql = require('mysql2/promise');
require('dotenv').config();

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'software_download',
  charset: 'utf8mb4'
};

async function initHolidayPoetryData() {
  let connection;
  
  try {
    console.log('🔗 连接数据库...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ 数据库连接成功');

    // 检查表是否存在
    console.log('🔍 检查表结构...');
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('holidays', 'poetry')
    `, [dbConfig.database]);

    if (tables.length < 2) {
      console.error('❌ 表结构不完整，请先运行 schema.sql 创建表结构');
      process.exit(1);
    }

    // 检查是否已有数据
    const [holidayCount] = await connection.execute('SELECT COUNT(*) as count FROM holidays');
    const [poetryCount] = await connection.execute('SELECT COUNT(*) as count FROM poetry');

    console.log(`📊 当前数据统计:`);
    console.log(`   节假日数据: ${holidayCount[0].count} 条`);
    console.log(`   古诗词数据: ${poetryCount[0].count} 条`);

    if (holidayCount[0].count > 0 || poetryCount[0].count > 0) {
      console.log('⚠️  数据库中已有数据，是否要清空并重新初始化？');
      console.log('   如需重新初始化，请先手动清空相关表数据');
      console.log('   或删除相关表后重新运行 schema.sql');
      return;
    }

    // 插入节假日数据
    console.log('📅 初始化节假日数据...');
    const holidays = [
      // 2025年节假日
      ['元旦', '2025-01-01', 'national', false, '新年第一天', 2025],
      ['春节', '2025-01-28', 'national', false, '农历新年，春节假期', 2025],
      ['春节', '2025-01-29', 'national', false, '农历新年，春节假期', 2025],
      ['春节', '2025-01-30', 'national', false, '农历新年，春节假期', 2025],
      ['春节', '2025-01-31', 'national', false, '农历新年，春节假期', 2025],
      ['春节', '2025-02-01', 'national', false, '农历新年，春节假期', 2025],
      ['春节', '2025-02-02', 'national', false, '农历新年，春节假期', 2025],
      ['春节', '2025-02-03', 'national', false, '农历新年，春节假期', 2025],
      ['清明节', '2025-04-05', 'national', false, '清明节', 2025],
      ['清明节', '2025-04-06', 'national', false, '清明节', 2025],
      ['清明节', '2025-04-07', 'national', false, '清明节', 2025],
      ['劳动节', '2025-05-01', 'national', false, '国际劳动节', 2025],
      ['劳动节', '2025-05-02', 'national', false, '国际劳动节', 2025],
      ['劳动节', '2025-05-03', 'national', false, '国际劳动节', 2025],
      ['劳动节', '2025-05-04', 'national', false, '国际劳动节', 2025],
      ['劳动节', '2025-05-05', 'national', false, '国际劳动节', 2025],
      ['端午节', '2025-05-31', 'national', false, '端午节', 2025],
      ['端午节', '2025-06-01', 'national', false, '端午节', 2025],
      ['端午节', '2025-06-02', 'national', false, '端午节', 2025],
      ['中秋节', '2025-10-06', 'national', false, '中秋节', 2025],
      ['中秋节', '2025-10-07', 'national', false, '中秋节', 2025],
      ['中秋节', '2025-10-08', 'national', false, '中秋节', 2025],
      ['国庆节', '2025-10-01', 'national', false, '国庆节', 2025],
      ['国庆节', '2025-10-02', 'national', false, '国庆节', 2025],
      ['国庆节', '2025-10-03', 'national', false, '国庆节', 2025],
      ['国庆节', '2025-10-04', 'national', false, '国庆节', 2025],
      ['国庆节', '2025-10-05', 'national', false, '国庆节', 2025],
      ['国庆节', '2025-10-06', 'national', false, '国庆节', 2025],
      ['国庆节', '2025-10-07', 'national', false, '国庆节', 2025],
      // 2026年节假日
      ['元旦', '2026-01-01', 'national', false, '新年第一天', 2026],
      ['春节', '2026-01-29', 'national', false, '农历新年，春节假期', 2026],
      ['春节', '2026-01-30', 'national', false, '农历新年，春节假期', 2026],
      ['春节', '2026-01-31', 'national', false, '农历新年，春节假期', 2026],
      ['春节', '2026-02-01', 'national', false, '农历新年，春节假期', 2026],
      ['春节', '2026-02-02', 'national', false, '农历新年，春节假期', 2026],
      ['春节', '2026-02-03', 'national', false, '农历新年，春节假期', 2026],
      ['春节', '2026-02-04', 'national', false, '农历新年，春节假期', 2026]
    ];

    for (const holiday of holidays) {
      await connection.execute(`
        INSERT INTO holidays (name, date, type, is_workday, description, year)
        VALUES (?, ?, ?, ?, ?, ?)
      `, holiday);
    }

    console.log(`✅ 节假日数据初始化完成，共插入 ${holidays.length} 条记录`);

    // 插入古诗词数据
    console.log('📚 初始化古诗词数据...');
    const poetryData = [
      ['游山西村', '陆游', '宋', '山重水复疑无路，柳暗花明又一村。', '山峦重叠水流曲折正担心无路可走，柳绿花艳忽然眼前又出现一个山村。', '这首诗写于诗人罢官闲居期间，表达了诗人对农村生活的热爱和对前途的乐观态度。', JSON.stringify(['哲理', '乐观', '农村']), true],
      ['送杜少府之任蜀州', '王勃', '唐', '海内存知己，天涯若比邻。', '四海之内有知心朋友，即使远在天边也如近在比邻。', '这是王勃送别友人的名句，表达了真挚的友谊可以超越空间距离。', JSON.stringify(['友谊', '送别', '哲理']), true],
      ['己亥杂诗', '龚自珍', '清', '落红不是无情物，化作春泥更护花。', '落花不是无情的东西，化作春天的泥土还能培育出新的花朵。', '诗人以落花自喻，表达了自己虽然离开官场，但仍愿为国家培养人才的志向。', JSON.stringify(['奉献', '哲理', '爱国']), true],
      ['行路难', '李白', '唐', '长风破浪会有时，直挂云帆济沧海。', '相信总有一天，能乘长风破万里浪；高高挂起云帆，在沧海中勇往直前！', '李白在政治失意时写下的名句，表达了对未来的坚定信念和豪迈气概。', JSON.stringify(['励志', '豪迈', '信念']), true],
      ['望岳', '杜甫', '唐', '会当凌绝顶，一览众山小。', '我一定要登上泰山的顶峰，俯瞰那众山，而众山在我眼中是多么的渺小。', '杜甫青年时期的作品，表达了诗人远大的抱负和豪迈的气概。', JSON.stringify(['励志', '抱负', '豪迈']), true],
      ['将进酒', '李白', '唐', '天生我材必有用，千金散尽还复来。', '上天造就了我的才干就必然是有用处的，千两黄金花完了也能够再次获得。', '李白豪放诗风的代表作，体现了诗人乐观自信的人生态度。', JSON.stringify(['自信', '豪放', '乐观']), true],
      ['酬乐天扬州初逢席上见赠', '刘禹锡', '唐', '沉舟侧畔千帆过，病树前头万木春。', '沉船的旁边正有千艘船驶过，病树的前头却也是万木争春。', '刘禹锡在贬谪期间写下的名句，表达了诗人对未来的乐观态度。', JSON.stringify(['哲理', '乐观', '新生']), true],
      ['陋室铭', '刘禹锡', '唐', '山不在高，有仙则名。水不在深，有龙则灵。', '山不在于高，有了神仙就出名。水不在于深，有了龙就显得有了灵气。', '刘禹锡的经典名句，表达了品德高尚比外在条件更重要的哲理。', JSON.stringify(['品德', '哲理', '修养']), true],
      ['饮酒', '陶渊明', '东晋', '采菊东篱下，悠然见南山。', '在东篱之下采摘菊花，悠然间，那远处的南山映入眼帘。', '陶渊明田园诗的代表作，体现了诗人超脱世俗、回归自然的心境。', JSON.stringify(['田园', '超脱', '自然']), true],
      ['使至塞上', '王维', '唐', '大漠孤烟直，长河落日圆。', '浩瀚沙漠中孤烟直上，无尽黄河上落日浑圆。', '王维边塞诗的名句，描绘了边塞壮阔的自然风光。', JSON.stringify(['边塞', '壮阔', '自然']), true],
      ['无题', '李商隐', '唐', '春蚕到死丝方尽，蜡炬成灰泪始干。', '春蚕结茧到死时丝才吐完，蜡烛要燃完成灰时像泪一样的蜡油才能滴干。', '李商隐爱情诗的名句，表达了至死不渝的爱情。', JSON.stringify(['爱情', '执着', '奉献']), true],
      ['过零丁洋', '文天祥', '宋', '人生自古谁无死，留取丹心照汗青。', '人生自古以来有谁能够长生不死？我要留一片爱国的丹心映照史册。', '文天祥在被俘后写下的名句，体现了崇高的民族气节。', JSON.stringify(['爱国', '气节', '牺牲']), true],
      ['虞美人', '李煜', '南唐', '问君能有几多愁？恰似一江春水向东流。', '要问我心中有多少哀愁，就像这不尽的滔滔春水滚滚东流。', '李煜亡国后的名句，以江水比喻愁思，形象生动。', JSON.stringify(['愁思', '亡国', '比喻']), true],
      ['青玉案·元夕', '辛弃疾', '宋', '众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。', '我在人群中寻找她千百回，猛然回头，那人却在，灯火零落之处。', '辛弃疾词中的名句，常用来比喻苦苦追寻后突然发现的惊喜。', JSON.stringify(['寻找', '惊喜', '哲理']), true],
      ['水调歌头', '苏轼', '宋', '人有悲欢离合，月有阴晴圆缺，此事古难全。', '人有悲欢离合的变迁，月有阴晴圆缺的转换，这种事自古来难以周全。', '苏轼中秋词中的名句，体现了诗人对人生哲理的深刻思考。', JSON.stringify(['哲理', '人生', '豁达']), true],
      ['静夜思', '李白', '唐', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。', '李白最著名的思乡诗，语言简洁，意境深远。', JSON.stringify(['思乡', '月亮', '简洁']), false],
      ['春晓', '孟浩然', '唐', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', '春天睡醒不觉天已大亮，到处可以听见小鸟的鸣叫声。回想昨夜的阵阵风雨声，吹落了多少花儿。', '孟浩然描写春天的名诗，语言清新自然。', JSON.stringify(['春天', '自然', '清新']), false],
      ['登鹳雀楼', '王之涣', '唐', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。', '太阳依傍山峦沉落，黄河向着大海滔滔东流。如果要想看千里的风光，那就要登上更高的一层楼。', '王之涣的登高诗，表达了积极向上的人生态度。', JSON.stringify(['登高', '哲理', '积极']), false],
      ['悯农', '李绅', '唐', '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。', '农民在正午的烈日下锄地，汗水滴落在禾苗下的泥土里。又有谁知道盘中的米饭，粒粒都是农民辛苦得来的。', '李绅描写农民辛苦劳作的诗，体现了对劳动人民的同情。', JSON.stringify(['农民', '辛苦', '珍惜']), false],
      ['咏鹅', '骆宾王', '唐', '鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。', '鹅，鹅，鹅，弯曲着脖子朝天欢叫。洁白的羽毛漂浮在碧绿的水面上，红红的脚掌拨动着清清的水波。', '骆宾王七岁时的作品，语言生动活泼。', JSON.stringify(['动物', '童趣', '生动']), false]
    ];

    for (const poetry of poetryData) {
      await connection.execute(`
        INSERT INTO poetry (title, author, dynasty, content, translation, notes, tags, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, poetry);
    }

    console.log(`✅ 古诗词数据初始化完成，共插入 ${poetryData.length} 条记录`);

    // 验证数据
    const [finalHolidayCount] = await connection.execute('SELECT COUNT(*) as count FROM holidays');
    const [finalPoetryCount] = await connection.execute('SELECT COUNT(*) as count FROM poetry');

    console.log('\n🎉 数据初始化完成！');
    console.log(`📊 最终数据统计:`);
    console.log(`   节假日数据: ${finalHolidayCount[0].count} 条`);
    console.log(`   古诗词数据: ${finalPoetryCount[0].count} 条`);

  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

// 运行初始化
initHolidayPoetryData();
