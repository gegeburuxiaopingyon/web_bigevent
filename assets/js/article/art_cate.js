$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取表格数据
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 添加弹出框内容
    var addIndex = null;
    $('#btnAddCate').on('click', function () {
        addIndex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })
    // 添加表格内容
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                } else {
                    layer.msg('添加成功')
                    initArtCateList()
                    layer.close(addIndex)
                }
            }
        })
    })
    // 编辑弹出框内容
    var editIndex = null;
    $('body').on('click', '#btn-edit', function () {
        editIndex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '编辑文章分类'
            , content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 编辑按钮
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('修改失败')
                } else {
                    layer.msg('修改成功')
                    initArtCateList()
                    layer.close(editIndex)
                }
            }
        })
    })
    // 删除按钮
    $('body').on('click', '#btn-del', function () {
        var id = $(this).attr('data-id');
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    } else {
                        layer.msg('删除成功');
                        initArtCateList();
                        layer.close(index);
                    }
                }
            })
            layer.close(index);
        });
    })
})