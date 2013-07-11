var model;
var viewModel;

function initialize()
{
	// retrieve the character sheet data
	$.getJSON( window.location.pathname + '/json', processCharacterData );
}

function processCharacterData(data,textStatus,jqXHR)
{
	// apply modified json document to page
	model = data;
	viewModel = new SheetViewModel(data);
	viewModel.skills.editing.subscribe(function(state){
		$('.draggableSkill').draggable({revert:true, disabled: !state});
	});
	viewModel.totals.skill_cap.subscribe(function(){
		$('.droppableSkill').droppable({ hoverClass: 'dropHoverRow',
			drop: function(evt,ui){
				// get the skill text
				var skill = ui.draggable.find('span').text();
				// remove from dragged elem
				ko.contextFor(ui.draggable.find('span')[0]).$parent.skills.remove(skill);
				// add to dropped elem
				ko.dataFor(evt.target).skills.push(skill);
			}
		});
	});
	ko.applyBindings(viewModel);
	viewModel.skills.editing.valueHasMutated();
	viewModel.totals.skill_cap.valueHasMutated();
}

function pushToServer(){
	var data = ko.toJSON(viewModel);
	//console.log(data);
	$.post( window.location.pathname + '/json', data, function(data,textStatus,xhr){
		console.log('Success');
	});
}

function removeAspect(index){
	console.log('Removing aspect at ', index);
	viewModel.aspects.aspects.splice(index,1);
}

function addAspect(){
	console.log('Adding aspect');
	viewModel.aspects.aspects.push( {name: ko.observable(), description: ko.observable()} );
}

function removeStressTrack(index){
	console.log('Removing stress track at', index);
	viewModel.stress.splice(index,1);
}

function addStressTrack(){
	console.log('Adding stress track');
	viewModel.stress.push( new StressTrack({
		'name': 'Stress',
		'skill': 'Skill',
		'toughness': 0,
		'boxes': [
			{'used':false},
			{'used':false}
		],
		'armor': []
	}) );
}

function addArmorTo(index){
	console.log('Adding armor to track', index);
	viewModel.stress()[index].armor.push( new StressArmor({
		'vs': 'source',
		'strength': 0
	}) );
}

function removeArmorFrom(track,armor){
	console.log('Removing armor', armor, 'from track', track);
	viewModel.stress()[track].armor.splice(armor,1);
}

function removeConsequenceAt(index){
	console.log('Removing consequence at', index);
	viewModel.consequences.splice(index,1);
}

function addConsequence(){
	console.log('Adding consequence');
	viewModel.consequences.push( new Consequence({
		'severity': 'Mild',
		'mode': 'Any',
		'used': false,
		'aspect': ''
	}));
}

function updateConseqAspect(conseq){
	var index = conseq.id.substr(-1,1);
	console.log(conseq.checked);
	if( conseq.checked ){
		console.log('Display input box');
		$( $('.conseqAspectDisplay')[index] ).hide();
		$( $('.conseqAspectEdit')[index] ).show().focus();
	}
	else {
		viewModel.consequences()[index].aspect( '' );
	}
}

function finishConseqUpdate(evt, index){
	if( evt.charCode == 13 ){
		console.log('Hiding field');
		$(evt.target).hide();
		$( $('.conseqAspectDisplay')[index] ).show();
	}
}

function moveSkillTo(field, level, diff){
	var newLevel = level+diff;
	var i = viewModel.skills.lists[level]().indexOf(field);
	if( newLevel >= 0 && newLevel <= viewModel.totals.skill_cap() ){
		//console.log('Move', field, 'to', level+diff);
		var skill = viewModel.skills.lists[level].splice(i,1);
		viewModel.skills.lists[newLevel].push(field);
		viewModel.skills.lists[newLevel].sort();
	}
	if( validateSkills() ){
		$('#validSkillLadder').html('Valid');
	}
	else {
		$('#validSkillLadder').html('INVALID')
	}
		
}

function validateSkills(){
	var valid = true;
	for( var i=1; i<viewModel.totals.skill_cap(); i++ ){
		var skills = viewModel.skills.lists;
		valid &= skills[i]().length >= skills[i+1]().length;
	}
	return valid;
}

function addSkill(evt){
	var skill = $('#newSkill').val();
	viewModel.skills.lists[0].push(skill);
	$('#newSkill').val('');
	$('.draggableSkill').draggable({revert:true, disabled: !viewModel.skills.editing()});
}

function removePower(i){
	viewModel.powers.splice(i,1);
}

function addPower(){
	viewModel.powers.push( new Power({
		'cost': 0,
		'name': 'New power',
		'description': 'A short description'
	}) );
}
