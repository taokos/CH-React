import { observable, computed } from 'mobx'

export const store = new class Store {
  // HTML
  @observable height = window.innerHeight
  @observable width = window.innerWidth
  
  // API
  @observable baseUrl = 'https://codehub.loc'
  @observable apiUrl = 'https://st1-api.gridics.com'

  // Map
  @observable zoom = 10
  @observable center = [25.64837124674059, -80.712685]
  @observable LayersAPI = '_map_tile_layers';
  @observable token = 'zmk6RrsXXbrw0o8j0fqA3g6LuKP207I1'
}
