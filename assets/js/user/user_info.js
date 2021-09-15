$(function () {
    var form = layui.form;
    var layer = layui.layer
    // 设置填写规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入1到6个字符之间'
            }
        }
    })
    // 获取用户信息
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                } else {
                    form.val('userForm', res.data);
                }
            }
        })

    }
    // 重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    // 用户提交按钮
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('提交信息失败')
                } else {
                    layer.msg('提交信息成功')
                    window.parent.getUserInfo()
                }
            }
        })
    })
})