/**
 * Created by hughdai on 17/5/8.
 * mixin methods
 */
/**
 * broadcast            向下传递
 * @param componentName 组件别名
 * @param eventName     事件别名
 * @param params        回调参数
 */
function broadcast(componentName, eventName, params) {
	// 遍历当前实例的子节点
	this.$children.forEach(child => {
		var name = child.$options.componentName;
		// 如果子节点名称和componentName相同,则说明该子节点为目标节点
		if (name === componentName) {
			// 找到目标节点后,触发event,并传入params
			child.$emit.apply(child, [eventName].concat(params));
		} else {
			// 如果子节点名称和componentName不相同,则遍历该子节点的子节点,直到找到目标子节点
			broadcast.apply(child, [componentName, eventName].concat([params]));
		}
	});
}
export default {
	methods: {
		/**
		 * dispatch             向上传递
		 * @param componentName 组件别名
		 * @param eventName     事件别名
		 * @param params        回调参数
		 */
		dispatch(componentName, eventName, params) {
			var parent = this.$parent || this.$root;
			var name = parent.$options.componentName;
			// 向上查找目标父节点,如果父节点名称和componentName相同,则说明该节点为目标父节点,否则继续向上查找
			while (parent && (!name || name !== componentName)) {
				parent = parent.$parent;

				if (parent) {
					name = parent.$options.componentName;
				}
			}
			// 找到目标父节点后,触发event,并传入params
			if (parent) {
				parent.$emit.apply(parent, [eventName].concat(params));
			}
		},
		broadcast(componentName, eventName, params) {
			broadcast.call(this, componentName, eventName, params);
		}
	}
};
