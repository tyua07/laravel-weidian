<?php

namespace App\Console\Commands;

use App\Library\SqlMigrations;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class ConvertMigrationsCommand extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'convert:migrations';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Converts an existing MySQL database to migrations.';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		self::createSqlMigrationsData(explode(',', str_replace(' ', '', $this->option('ignore'))), $this->argument('database'));
		//显示状态
		$this->info('Migration Created Successfully');
	}

	/**
	 * 执行迁移数据
	 *
	 * @param $ignoreInput
	 * @param $database
	 */
	private static function createSqlMigrationsData($ignoreInput, $database)
	{
		//设置 ignore
		SqlMigrations::ignore($ignoreInput);
		//导出sql
		SqlMigrations::convert($database);
		//写入文件
		SqlMigrations::write();
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [
			['database', InputArgument::REQUIRED, 'Name of Database to convert'],
		];
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return [
			['ignore', null, InputOption::VALUE_OPTIONAL, 'Tables to ignore', null],
		];
	}

}

