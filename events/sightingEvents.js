import {EventEmitter} from 'events'
import { createAlert } from '../utils/createAlert.js'

export const sightingEvents = new EventEmitter()

sightingEvents.on('sighting-added',createAlert)