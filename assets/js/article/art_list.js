$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    // 优化时间显示
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data);
        var y = dt.getFullYear();
        var m = dt.getMonth();
        var d = dt.getDate();
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable()
    initCate()
    // 获取列表数据
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                } else {
                    var htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr)
                    renderPage(res.total)
                }
            }
        })
    }
    // 渲染下拉框内容
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('渲染失败')
                } {
                    console.log(res.data);
                    var htmlStr = template('tpl-cate', res);
                    $('[name=cate_id]').html(htmlStr)
                    // 重新渲染
                    form.render()
                }
            }
        })
    }
    // 筛选绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    // 定义渲染分页方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 删除按钮绑定
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id');
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除失败')
                    } else {
                        layer.msg('删除成功')
                        if (len === 1) {
                            q.pagenum = p.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                }
            })

            layer.close(index);
        });
    })
})