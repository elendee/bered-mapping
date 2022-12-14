const css =`
.modal{
	position: fixed;
	z-index: 9999;
	top: 0px;
	left: 0px;
	font-size: 1rem;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background: rgba(0, 0, 0, .7);
}
.modal-close{
	user-select: none;
	position: absolute;
	z-index: 9;
	top: 10px;
	right: 1vw;
	background: black;
	color: white;
	cursor: pointer;
	height: 30px;
	width: 30px;
	border: 1px solid rgb(50, 50, 50);
    font-size: 1.5rem;
}
.modal-close:hover{
	background: white;
	color: black;
}
.modal-content{
	background: white;
	position: absolute;
	padding: 10px;
	margin-top: 20px;
	width: 100%;
	max-width: 96vw;
	overflow-y: auto;
	overflow-x: hidden;
	padding-top: 10px;
	max-height: calc(100vh - 40px);
	border: 1px solid grey;
}

.modal h1,
.modal h2,
.modal h3{
/*     color: white; */
}
.modal  .modal-header{
	color: #c1cafb;
	margin-bottom: 10px;
}
.modal .column h3.column-header{
	margin-top: 0;
}
/* .modal-row */
.modal .column{
	padding: 10px 10px 30px 10px;
	height: 90%;
}
.modal .left-panel{
}
.modal .right-panel{
}
.right-panel .button{
	margin: 5px 0;
	border: 1px solid grey;
}

.modal input{
    margin: 10px 0;
}
.modal label{
    text-align: left;
    font-weight: bold;
    width: 100%
}
.modal label,
.modal input[type=checkbox]{
	display: inline-block;
}
.modal input[type=checkbox]{
	width: 20px;
	height: 20px;
	vertical-align: middle;
	margin: 0 10px;
}

.modal input[type=submit]{
	display: inline-block;
	max-width: auto;
	width: auto;
}

.modal option{
	color: black;
	font-weight: bold;
}

@media screen and (max-width: 800px){
	.modal-close{
		right: 0px;
	}
}`

const style = document.createElement('style')
style.innerHTML = css
document.body.appendChild( style )


class Modal {

	constructor( init ){
		// init.id
		init = init || {}
		if( !init.type ) console.log('modal missing type')

		const modal = this

		const ele = modal.ele = document.createElement('div')
		modal.ele.classList.add('modal')
		modal.ele.id = init.id

		modal.close_type = init.close_type

		const type = modal.type = init.type
		modal.ele.classList.add( type )
		modal.ele.setAttribute('data-type', type )

		modal.content = document.createElement('div')
		modal.content.classList.add('modal-content')

		modal.close_btn = document.createElement('div')
		modal.close_btn.classList.add('modal-close', 'flex-wrapper')
		modal.close_btn.innerHTML = '&times;'
		modal.close_btn.addEventListener('click', () => {
			modal.close()
		})
		modal.ele.appendChild( modal.content )
		modal.ele.appendChild( modal.close_btn )

	}

	close(){

		if( this.close_type === 'hide' ){
			this.ele.style.display = 'none'
		}else{
			this.ele.remove()
		}
		// BROKER.publish('MODAL_CLOSE', { type: init.type })
	}

	make_columns(){

		this.left_panel = document.createElement('div')
		this.left_panel.classList.add('column', 'column-2', 'left-panel')

		this.right_panel = document.createElement('div')
		this.right_panel.classList.add('column', 'column-2', 'right-panel')

		this.content.appendChild( this.left_panel )
		this.content.appendChild( this.right_panel )

		this.ele.classList.add('has-columns')
		
	}


}



export {
	Modal,
	// ModalTrigger,
	// StatusBar,
}

