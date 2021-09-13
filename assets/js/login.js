$(function () {
    // 登录和注册界面的切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 帐号密码的规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次输入不一致，请重新输入'
            }
        }
    })
    //监听注册提交
    $('#form-reg').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }
        $.post('/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                } else {
                    layer.msg('注册成功，请登录');
                    $('#link_login').click();
                }
            })
    })
    $('#form-login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                } else {
                    layer.msg('登录成功');
                    localStorage.setItem('token', res.token);
                    location.href = '/index.html'
                }
            }
        })
    })
})