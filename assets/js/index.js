$(function () {
    getUserInfo()
    $('#btn-out').on('click', function () {
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('登录失败')
            } else {
                renderAvatar(res.data)
            }
        }
    })
    function renderAvatar(user) {
        var name = user.nickname || user.username;
        $('#welcome').html('欢迎&nbsp&nbsp' + name)
        var first = name[0].toUpperCase()
        if (user.user_pic !== null) {
            $('.text-avatar').hide();
            $('.layui-nav-img').attr('src', user.user_pic).show()
        } else {
            $('.layui-nav-img').hide();
            $('.text-avatar').html(first).show();
        }
    }
}