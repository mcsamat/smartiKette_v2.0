export class System {
    constructor(
        public smartikette_version: any,
        public system_boot_time: string,
        public system_disk_total_space: any,
        public system_disk_free_space: any, 
        public php_version: string,
        public apache_version: string, 
        public apache_uptime: string, 
        public mariadb_version: string, 
        public mariadb_uptime: string, 
        public mongodb_version: string, 
        public mongodb_uptime: string, 
    ) {} 
}