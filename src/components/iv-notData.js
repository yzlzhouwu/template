export default {
  name: 'iv-notData',
  functional: true,
  props: {
    title: String
  },
  render: (h, { props }) => {
    return h('div', {
      style: {
        fontSize: '14px !important',
        color: '#80848f',
        textAlign: 'center'
      }
    }, [h('img', { attrs: { src: require('../assets/images/notContent.png'), alt: '暂无数据' } }), h('p', props.title ? props.title : '暂无数据')])
  }
}
