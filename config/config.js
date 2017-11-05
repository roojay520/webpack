const website = {
    publicPath: '',
};
// 静态资源路径设置
process.env.type == 'build' ? (website.publicPath = 'http://cdn.roojay.com/') : (website.publicPath = 'http://127.0.0.1:4399/');

module.exports = website;

