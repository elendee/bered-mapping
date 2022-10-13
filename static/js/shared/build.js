const build_section = () => {
	const wrapper = document.createElement('div')
	wrapper.classList.add('section')
	return wrapper
}

const build_button = text => {
	const wrapper = document.createElement('div')
	wrapper.innerText = text
	wrapper.classList.add('button')
	return wrapper
}


export {
	build_section,
	build_button,
}