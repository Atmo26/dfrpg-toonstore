var model;
var viewModel;


function SheetViewModel(data)
{
	// initialize general data
	this.name = ko.observable(data.name);
	this.player = ko.observable(data.player);

	// initialize aspect data
	this.aspects = {
		'high_concept': {
			'name': ko.observable(data.aspects.high_concept.name),
			'description': ko.observable(data.aspects.high_concept.description)
		},
		'trouble': {
			'name': ko.observable(data.aspects.trouble.name),
			'description': ko.observable(data.aspects.trouble.description)
		},
		'aspects': ko.observableArray()
	};
	for( var i in data.aspects.aspects ){
		var aspect = data.aspects.aspects[i];
		this.aspects.aspects.push({
			'name': ko.observable(aspect.name),
			'description': ko.observable(aspect.description)
		});
	}

	// construct stress data
	this.stress = ko.observableArray();
	for( var i in data.stress )
	{
		// construct a single stress track
		var track = data.stress[i];
		var viewTrack = {
			'name': ko.observable(track.name),
			'skill': ko.observable(track.skill),
			'toughness': ko.observable(track.toughness),
			'boxes': ko.observableArray(),
			'armor': ko.observableArray()
		};
		viewTrack.strength = ko.computed({
			'read': function(){
				return this.boxes().length;
			},
			'write': function(str){
				var diff = str - this.boxes().length;
				if( diff > 0 ){
					for( var i=0; i<diff; i++ ){
						this.boxes.push({
							'used': ko.observable(false),
							'icon': ko.computed(function(){
								var icon = 'stressBox';
								if( track.toughness != 0 && j == track.boxes.length-track.toughness )
									icon += ' leftParen';
								if( track.toughness != 0 && j == track.boxes.length-1 )
									icon += ' rightParen';
								return icon;
							}, viewTrack)
						});
					}
				}
				else if( diff < 0 ){
					
				}
			}}, viewTrack
		);

		// construct stress boxes
		for( var j=0; j<track.boxes.length; j++ ){
			var box = {
				'used': ko.observable(track.boxes[j].used),
				'icon': ko.computed(function(){
					var icon = 'stressBox';
					if( track.toughness != 0 && j == track.boxes.length-track.toughness )
						icon += ' leftParen';
					if( track.toughness != 0 && j == track.boxes.length-1 )
						icon += ' rightParen';
					return icon;
				}, viewTrack)
			}
			viewTrack.boxes.push(box);
		}

		// construct armor boxes
		for( var j=0; j<track.armor.length; j++ ){
			var armor = {
				'vs': ko.observable(track.armor[j].vs),
				'strength': ko.observable(track.armor[j].strength)
			};
			armor.text = ko.computed(function(){
				return 'Armor: '+armor.strength()+' vs. '+armor.vs();
			}, armor);
			viewTrack.armor.push(armor);
		}

		this.stress.push(viewTrack);
	}

	// initialize consequence data
	this.consequences = ko.observableArray();
	for( var i in data.consequences ){
		var oldConseq = data.consequences[i];
		var conseq = {
			'severity': ko.observable(oldConseq.severity),
			'mode': ko.observable(oldConseq.mode),
			'used': ko.observable(oldConseq.used),
			'aspect': ko.observable(oldConseq.aspect)
		};
		conseq.magnitude = ko.computed(function(){
			var map = {'Mild': -2, 'Moderate': -4, 'Severe': -6, 'Extreme': -8};
			return map[this.severity()];
		}, conseq);
		
		this.consequences.push(conseq);
	}

	// initialize skills data
	this.skills = {
		"6": ko.observableArray(data.skills[6]),
		"5": ko.observableArray(data.skills[5]),
		"4": ko.observableArray(data.skills[4]),
		"3": ko.observableArray(data.skills[3]),
		"2": ko.observableArray(data.skills[2]),
		"1": ko.observableArray(data.skills[1])
	};

	// initialize powers data
	this.powers = ko.observableArray();
	for( var i in data.powers ){
		var oldPower = data.powers[i];
		var power = {
			'cost': ko.observable(oldPower.cost),
			'name': ko.observable(oldPower.name),
			'description': ko.observable(oldPower.description)
		};
		power.clean_description = ko.computed(function(){
			return this.description().split('<br>');
		}, power);
		this.powers.push(power);
	}
	this.powers.total = ko.computed(function(){
		var sum = 0;
		for( var i in this.powers() ){
			sum += this.powers()[i].cost();
		}
		return sum;
	}, this);

	// initialize totals data
	this.totals = {
		'power_level': ko.observable(data.totals.power_level),
		'base_refresh': ko.observable(data.totals.base_refresh),
		'skill_cap': ko.observable(data.totals.skill_cap),
		'skills_total': ko.observable(data.totals.skills_total),
		'skills_available': ko.observable(data.totals.skills_available),
		'adjusted_refresh': ko.observable(data.totals.adjusted_refresh),
		'fate_points': ko.observable(data.totals.fate_points)
	};
	this.totals.skill_text = function(val){
		var ladder = ['Mediocre (+0)', 'Average (+1)', 'Fair (+2)', 'Good (+3)', 'Great (+4)', 'Superb (+5)', 'Fantastic (+6)', 'Epic (+7)', 'Legendary (+8)'];
		return ladder[val];
	};
	this.totals.skill_cap_text = ko.computed(function(){
		return this.skill_text(this.skill_cap());
	}, this.totals);
	this.totals.skills_spent = ko.computed(function(){
		return this.skills_total() - this.skills_available();
	}, this.totals);


	this.skills.skill_sets = ko.computed(function(){
		var sets = [];
		for( var i=this.totals.skill_cap(); i>0; i-- ){
			sets.push({
				'level_text': this.totals.skill_text(i),
				'skills': this.skills[i]
			});
		}
		return sets;
		
	}, this);
}

function processCharacterData(data,textStatus,jqXHR)
{
	// apply modified json document to page
	model = data;
	viewModel = new SheetViewModel(data);
	ko.applyBindings(viewModel);
}

function initialize(){
	// retrieve the character sheet data
	$.getJSON( window.location.pathname + '/json', processCharacterData );
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
