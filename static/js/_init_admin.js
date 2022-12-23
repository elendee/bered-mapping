// import hal from '../hal.js?v=115'


import {
	// ModelRow,
	fetch_wrap,
	tstack,
	hal,
	// format_date,
	// get_domain,
} from './lib.js?v=115'

// import build_form from './build_form.js?v=115'


// tstack('init_admin')

console.log('bered-admin js')




//--------------------------------------------------------------- declare vars

const wrap = document.querySelector('.wrap.bered')

const sections = wrap.querySelectorAll('.bered .section')
const tabs = wrap.querySelectorAll('.nav-tab.main-tab')

const set_tab = e => {
	const tab = e.target
	for( const tab of tabs ){
		tab.classList.remove('selected')
	}
	tab.classList.add('selected')
}

for( const tab of tabs ){
	tab.addEventListener('click', set_tab )
}

