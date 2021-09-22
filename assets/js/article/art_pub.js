$(function () {
    var layer = layui.layer;
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('请求失败')
                } else {
                    var htmlStr = template('tpl-cate', res);
                    $('[name=cate_id]').html(htmlStr)
                    form.render()
                }
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 绑定选择封面按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 切换图片
    $('#coverFile').on('change', function (e) {
        var file = e.target.files
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 发布状态
    var art_status = '已发布';
    $('#btn-save2').on('click', function () {
        art_status = '草稿'
    })
    // 监听表单提交
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0])
        fd.append('state', art_status)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('发布失败')
                } else {
                    layer.msg('发布成功')
                    location.href = '/article/art_list.html'
                }
            }
        })
    }
})